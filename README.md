# Notes

This is a simple note taking software. It is purely client-side web-based and uses Google Drive as its storage.

It requires a OAUTH2 key in the form of drive_api_key_PASSWORD.txt, where PASSWORD is the password for your notes program. To get the key for your Google Drive account, follow these steps:

1. Go to the [Google APIs Developer Console](https://console.developers.google.com/).
1. Create a new project if you don't already have one.
1. Go to Library -> Google Drive, and enable the API.
1. Go to Credentials and create a OAuth Client ID.
1. The type is web application.
1. Under the Authorized JavaScript origins, add the host name where you will have the notes program. http://localhost works as well.
1. Copy the newly created crednetial's client ID into a drive_api_key_PASSWORD.txt in your notes program folder, where PASSWORD is the password you want to use.
1. In the browser, go to the notes program, and use ?p=PASSWORD, where the PASSWORD is the same password.
1. A new window should open with the Google API sign in. Accept it, and the notes program should handle the rest.
