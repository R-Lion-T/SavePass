const path = require('path')
const { Application } = require('spectron')

const appPath = () => {
  switch (process.platform) {
    case 'darwin':
      return path.join(__dirname, '..', '.tmp', 'mac', 'ElectronReact.app', 'Contents', 'MacOS', 'ElectronReact')
    case 'linux':
      return path.join(__dirname, '..', '.tmp', 'linux', 'ElectronReact')
    case 'win32':
      return path.join(__dirname, '..', '.tmp', 'win-unpacked', 'ElectronReact.exe')
    default:
      throw Error(`Unsupported platform ${process.platform}`)
  }
}
global.app = new Application({ path: appPath() })
