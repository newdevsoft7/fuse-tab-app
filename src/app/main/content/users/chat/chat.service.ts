import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { environment } from '../../../../../environments/environment';

import 'rxjs/add/operator/map';

const BASE_URL = `${environment.apiUrl}`;
const USER_URL = `${BASE_URL}/user`;


import { FuseUtils } from '../../../../core/fuseUtils';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class UsersChatService {

  currentMessage = new BehaviorSubject(null);

  constructor(
    private http: HttpClient) {}

  get Device(): number {
    return parseInt(localStorage.getItem('device'), 10);
  }

  set Device(device: number) {
    if (device) {
      localStorage.setItem('device', device.toString());
    } else {
      localStorage.removeItem('device');
    }
  }

  get isDeviceSaved(): boolean {
    return !!localStorage.getItem('device');
  }

  async removeDevice(): Promise<any> {
    const url = `${USER_URL}/device/${this.Device}`;
    return await this.http.delete(url).toPromise();
  }

  async registerDevice(firebase_token: string) {
    const url = `${USER_URL}/device`;
    try {
      const deviceId = await this.http.post(url, { firebase_token }).map((_: any) => _.id).toPromise();
      this.Device = deviceId;
    } catch (e) {
      throw new Error(e.message || 'Something is wrong');
    }
  }

  async updateDevice(firebase_token: string) {
    const url = `${USER_URL}/device/${this.Device}`;

    try {
      await this.http.put(url, { firebase_token }).toPromise();
    } catch (e) {
      throw new Error(e.message || 'Something is wrong');
    }
  }

  async sendMessage(body: any): Promise<any> {
    const url = `${USER_URL}/message`;
    return this.http.post(url, body).toPromise();
  }

  async getMessagesByUser(userId: number) {
    const url = `${USER_URL}/${userId}/message`;
    return this.http.get(url).toPromise();
  }

  /**
   * temporarly section
   */
  contacts: any[];
    chats: any[];
    user: any;
    onChatSelected = new BehaviorSubject<any>(null);
    onContactSelected = new BehaviorSubject<any>(null);
    onChatsUpdated = new Subject<any>();
    onUserUpdated = new Subject<any>();
    onLeftSidenavViewChanged = new Subject<any>();
    onRightSidenavViewChanged = new Subject<any>();

    /**
     * Get chat
     * @param contactId
     * @returns {Promise<any>}
     */
    getChat(contactId)
    {
        const chatItem = this.user.chatList.find((item) => {
            return item.contactId === contactId;
        });

        /**
         * Create new chat, if it's not created yet.
         */
        if ( !chatItem )
        {
            this.createNewChat(contactId).then((newChats) => {
                this.getChat(contactId);
            });
            return;
        }

        return new Promise((resolve, reject) => {
            this.http.get('api/chat-chats/' + chatItem.id)
                .subscribe((response: any) => {
                    const chat = response;

                    const chatContact = this.contacts.find((contact) => {
                        return contact.id === contactId;
                    });

                    const chatData = {
                        chatId : chat.id,
                        dialog : chat.dialog,
                        contact: chatContact
                    };

                    this.onChatSelected.next({...chatData});

                }, reject);

        });

    }

    /**
     * Create New Chat
     * @param contactId
     * @returns {Promise<any>}
     */
    createNewChat(contactId)
    {
        return new Promise((resolve, reject) => {

            const contact = this.contacts.find((item) => {
                return item.id === contactId;
            });

            const chatId = FuseUtils.generateGUID();

            const chat = {
                id    : chatId,
                dialog: []
            };

            const chatListItem = {
                contactId      : contactId,
                id             : chatId,
                lastMessageTime: '2017-02-18T10:30:18.931Z',
                name           : contact.name,
                unread         : null
            };

            /**
             * Add new chat list item to the user's chat list
             */
            this.user.chatList.push(chatListItem);

            /**
             * Post the created chat
             */
            this.http.post('api/chat-chats', {...chat})
                .subscribe((response: any) => {

                    /**
                     * Post the new the user data
                     */
                    this.http.post('api/chat-user/' + this.user.id, this.user)
                        .subscribe(newUserData => {

                            /**
                             * Update the user data from server
                             */
                            this.getUser().then(updatedUser => {
                                this.onUserUpdated.next(updatedUser);
                                resolve(updatedUser);
                            });
                        });
                }, reject);
        });
    }

    /**
     * Select Contact
     * @param contact
     */
    selectContact(contact)
    {
        this.onContactSelected.next(contact);
    }

    /**
     * Set user status
     * @param status
     */
    setUserStatus(status)
    {
        this.user.status = status;
    }

    /**
     * Update user data
     * @param userData
     */
    updateUserData(userData)
    {
        this.http.post('api/chat-user/' + this.user.id, userData)
            .subscribe((response: any) => {
                    this.user = userData;
                }
            );
    }

    /**
     * Update the chat dialog
     * @param chatId
     * @param dialog
     * @returns {Promise<any>}
     */
    updateDialog(chatId, dialog): Promise<any>
    {
        return new Promise((resolve, reject) => {

            const newData = {
                id    : chatId,
                dialog: dialog
            };

            this.http.post('api/chat-chats/' + chatId, newData)
                .subscribe(updatedChat => {
                    resolve(updatedChat);
                }, reject);
        });
    }

    /**
     * Get Contacts
     * @returns {Promise<any>}
     */
    getContacts(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.http.get('api/chat-contacts')
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get Chats
     * @returns {Promise<any>}
     */
    getChats(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.http.get('api/chat-chats')
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Get User
     * @returns {Promise<any>}
     */
    getUser(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            this.http.get('api/chat-user')
                .subscribe((response: any) => {
                    resolve(response[0]);
                }, reject);
        });
    }
}
