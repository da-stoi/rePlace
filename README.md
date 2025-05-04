<div align="center">
	<picture>
	  <source media="(prefers-color-scheme: dark)" srcset="https://danielstoiber.com/api/project-image.svg?projectId=replace&centerContent=true&darkMode=true&hideDate=true">
	  <img alt="Most recent project card" src="https://danielstoiber.com/api/project-image.svg?projectId=replace&centerContent=true&hideDate=true">
	</picture>
</div>

# ❓ What is it?

**rePlace** is a _standalone application_ that lets you easily customize your reMarkable tablet’s **state screens** through an intuitive UI.  

**What are state screens?** These are the images your device displays during various system states like when it’s sleeping, powering off, rebooting, overheating or running out of battery.

Depending on your reMarkable’s firmware version, there are typically 7–8 of these screens you can modify, including:

- **Suspended / Hibernate** (sleep mode)
- **Powered Off**
- **Out of Battery**
- **Overheating**
- **Rebooting**
- **Starting**

The **Factory Reset** screen is not customizable as it only appears during a reset, which would erase any custom screens you’ve added anyway.

# 📖 How to Use It

## First Install

### MacOS

1. **Download the App**
   - Grab the latest `.dmg` file from the official **rePlace** release page.
2. **Install the App**
   - Open the `.dmg` and drag the **rePlace** app into your **Applications** folder.
3. **Bypass macOS Gatekeeper**
   - Attempt to open the app by double-clicking it. macOS will block it, stating it's from an unidentified developer.
   - To get around this:
     - Go to **System Settings** → **Privacy & Security**.
     - Scroll down and you’ll see a message about **rePlace** being blocked.
     - Click **"Open Anyway"**, then confirm again when prompted.
4. **Run the App**
   - Launch **rePlace** from your Applications folder or Launchpad.
   - You’ll only need to approve it the first time.

**Why do I need to bypass macOS Gatekeeper?**

- Apple charges $100/year to developers just to sign and notarize apps.
- If you're skeptical about running unsigned apps, good — you should be. But the project is open-source, so feel free to download the code and compile it yourself.

### Windows

1. **Download the Installer**
   - Visit the official **rePlace** release page and download the latest `.exe` installer.
2. **Run the Installer**
   - Double-click the `.exe` file to launch the setup wizard.
   - If Windows shows a **"Windows protected your PC"** warning:
     - Click **More info** → **Run anyway**.
3. **Follow the Setup Wizard**
   - Choose an install location or use the default.
4. **Launch the App**
   - Find **rePlace** in your Start Menu or desktop and run it.
   - You may get another permission prompt the first time.

### Linux

Linux is not yet supported; I am working on getting a functioning build of the application for Ubuntu. Hang in there Linux users, I didn't forget about you!

## Adding a Device

When you first launch **rePlace**, you'll be guided through the process of connecting your reMarkable by entering its connection details. If you've already set up a device and want to add another, just click the **Add Device** button on the main screen.

To find your device’s IP address and password, follow [this guide](https://remarkable.guide/guide/access/ssh.html#finding-your-device-password-and-ip-addresses).

> **Note:** If you're connecting via Wi-Fi, remember that your reMarkable’s IP address can change over time. If a device that previously worked no longer connects, double-check that the IP address hasn’t changed.

## Adding Screens

To manage your custom screens, click the **wrench icon**, then select **Screen Manager**. From there, you can:

- Upload custom screen files from your computer
- Or use the built-in screen creator to design a fun **rePlace** face directly in the app

## Settings

### Customization

- **Theme**  
   Choose how **rePlace** looks by selecting **Light**, **Dark**, or **System** theme.  
   _(Default: System)_
- **Skip Splash Screen**  
   Turn this on to bypass the animated splash screen when launching **rePlace**. (Yes, I had fun making it — no hard feelings if you skip it.)  
   _(Default: Off)_

### Updates

If there's a new version of **rePlace**, you’ll see it listed here with a changelog and download link. You can also opt-in to **pre-release updates**, which include the latest features, but be warned, they’re likely unstable.  
If something breaks in a pre-release, just delete the app and reinstall the latest stable version from the website.

### Developer Mode

Enabling Developer Mode unlocks advanced tools designed for testing and development. Unless you've changed the SSH port or username on your reMarkable, you probably don’t need this, but you're welcome to explore!

## Updating

When you launch **rePlace**, you'll get a notification if an update is available. The app doesn’t support auto-updates yet, but you can always check for the latest version manually by visiting the **Updates** section in settings. There, you'll find the newest release info, changelog, and a download link.

# ❤️ Motivation

I created **rePlace** because I wanted an easy way to customize my reMarkable tablet’s screens. At first, I just uploaded custom files directly, but they kept getting wiped every time the device updated. I built this tool to make the process simple, reliable, and safe — not just for myself, but for my mom and anyone else who wants to personalize their device without the risk of breaking something.

# 🔎 How does it work?

## TL;DR

Simply put, using the connection details you provide, the application will take your new screen and upload it to your device's file system, replacing the existing file.

## Technical Details

**Built on Electron**  
**rePlace** leverages [Electron](https://www.electronjs.org/), the same framework behind apps like Slack and Discord, to deliver a true cross-platform desktop application. By bundling Chromium and Node.js together, Electron lets us maintain a single JavaScript/HTML/CSS codebase that runs on Windows, macOS, and Linux without the need of native development.

**Security Boundary: Context Isolation**  
To keep powerful device APIs safe from malicious web content, Electron enforces [Context Isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation). This separation prevents UI code (render process) from directly accessing Node.js or OS-level calls.

**Bridging the Gap: IPC**  
Instead, Electron provides [Inter-Process Communication (IPC)](https://www.electronjs.org/docs/latest/tutorial/ipc), a secure channel between the UI and background (main) processes. UI events trigger IPC messages, which in turn invoke privileged background scripts.

**Uploading a Screen**

1. **Establish SSH Connection**
   - When you add or select a device, a background script receives your device details and opens an [SSH](https://www.wikiwand.com/en/articles/Secure_Shell) session.
2. **Send the Image**
   - Upon uploading, the UI sends the image as a [Data URL](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data) plus the target filename via IPC.
   - The background script decodes this Data URL and streams the resulting image over SSH, replacing the existing file on your reMarkable.
3. **Live Device Monitoring**
   - While you’re using the app, the UI regularly pings each device in the background. This keeps your connection statuses up to date on the main screen and alerts you if a device drops offline.

# 🏛️ History

## v0 (_Nov 2022 - Jan 2024_)

Version 0 was a basic Bash script using scp for file transfers. Users had to input device details into a .env file, requiring command-line knowledge and making the setup unclear. As a result, this version failed to simplify the process enough to be practical.

## v1 (_Jan 2024 - Nov 2024_)

Version 1 built an interactive UI around the command from v0. It was written in Next.js and required the user to run the project on their machine for the server to be able to connect to the device. This meant that it couldn’t be hosted, and also provided technical knowledge and an established development environment.

## v2 (_Nov 2025 - Present_)

Version 2 is designed to be a standalone, cross-platform application that seamlessly manages screens for multiple reMarkable devices over WiFi or USB. Users can either upload their own screens or create them using the integrated screen creation tool. This application strives to address the shortcomings of versions 0 and 1 by making it user-friendly.

# ⚠️ _Disclaimers_

While extensive care was put into putting safeguards in place to protect your **reMarkable**, there is still inherent risk in using unofficial modification software such as **rePlace**. This program is one of the least invasive methods of customizing your device, but by using it you assume the risks associated with modification. These risks include, but are not limited to:

- **Warranty & Support Voiding**
  - Beyond manufacturer warranty, any third-party support channels (e.g., community help forums or paid repair services) may refuse assistance for modified devices.
- [Bricking](<https://www.wikiwand.com/en/articles/Brick_(electronics)>) your device
  - “Rendering your device as useful as a paperweight” i.e. firmware corruption or failed writes have turned it into a completely non-functional brick.
  - There are ways to recover your device from this state, but they involve highly technical knowledge.
- **Security Vulnerabilities**
  - Enabling SSH-based uploads or running unsigned code can expose your device to unauthorized access if credentials are compromised.
- **Unintended Firmware Behavior**
  - Future official firmware updates may assume the stock screens are intact—modifications could trigger unexpected errors or crashes.
