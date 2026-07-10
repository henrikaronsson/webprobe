# Security

WebProbe is a static, client-side application. It does not run a backend or store user data on a server.

## Network requests

Most pages collect information locally in your browser. The **My Browser** page is the exception: it automatically fetches your public IP address from [api.ipify.org](https://api.ipify.org) when the page opens. No other third-party network calls are made by WebProbe.

If you open My Browser, api.ipify.org receives a standard HTTPS request from your browser and may log connection metadata according to their policies. WebProbe does not send your full browser report to any server.

## Sensitive information

The My Browser report can include data useful for fingerprinting (user agent, screen size, capabilities, and public IP). Use the **Copy report** button only when you intend to share that information.

## Reporting issues

If you discover a security concern in this project, open an issue in the repository or contact the maintainer privately.
