构建：

```bash
git submodule init
git submodule update
npm install
npm run pro-build

将会生成dist目录
```

nginx配置

```bash
server
	{
		location / {
				index  index.html;
				try_files $uri $uri/ /index.html;
		}
	}
```

branch add-redeem 有 redeem mint 的代码 未上线。
