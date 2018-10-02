# example

## Usage

**install node modules**

```
npm run install
```

**local**

```
npm run start
```

**develop**

```
npm run build:dev
npm run start:dev
```

### hot replace

when you change the client side files, such as 'client/component/Home.jsx' or 'client/component/home.scss', webpack will recompile and the page will reload.

when you change the server side files, such as 'server/api.js', the node mudules will be hot replaced.