## 基础信息
- 当前工程为从一个git开源工程fork出的新功能，基于此工程做OEM、功能修改等。以下为注意事项：
    - 调试时在本地使用docker compose方式进行，本地已经安装好docker desktop。重启容器时，请尽量只重启必要的容器，不要docker compose down然后再启动所有容器，除非必须这么做
    - docker部署文件的修改请在 ./docker-oem文件夹下进行，它是官方安装文件 ./docker 的一个复制。请不要修改 ./docker中的任何内容，它只能被用来作为官方部署方式的参考。
    - 线上环境在 192.168.10.109 中，可以使用ssh命令对其进行部署、上线、调整动作。线上部署的相关文件应该放到 /root/laiye-bisheng-oem 目录下。
    - 禁止使用替换容器中的文件的方法来在本地调试，当修改了功能需要验证时，都应该采用重建镜像并且重新启动容器的的方式进行。构建镜像时不需要使用--quiet参数
    - 借助chromdevtools工具来打开产品页面，验证功能修改是否完成。使用此工具时，都请：
        - 强制刷新页面，避免缓存的影响
        - 产品需要登录，如果要检查登录后的页面，可以先打开页面，请求用户手动登录，然后再进行后续的页面检查
        - 使用snapshot工具获取了内容到本地，并且阅读了文档内容之后，请主动删除这些txt文件
- 你在本地工作的环境为Windows，请使用powershell命令执行一些系统操作，例如powershell -Command "具体的命令"以避免错误

## 工程信息
- Template Storage: The templates are stored in /src/backend/bisheng/database/data/template.json and loaded into the database during initialization (see init_data.py line 92-95).
- Language Configuration: The frontend is configured to use Chinese by default (see i18n.js line 17: lng: 'zh'), although it supports English and other languages.
- Template Display: Templates are displayed via the API endpoint /api/v1/skill/template which reads from the database table template.

## 构建信息
- frontend的构建信息
  1. Dockerfile.frontend.oem 
    - 用途：仅复制静态文件到预构建镜像
    - 适用：只修改资源文件（图片、配置）时使用
  2. Dockerfile.frontend.oem.build 
    - 用途：完整的源代码构建，包含所有修复
    - 特点：
        - 包含本地包复制
      - 正确的输出目录（build）
      - 生产环境配置

- backend的构建信息
  1. Dockerfile.backend.oem

  - Simple and clean Dockerfile that extends the official backend image
  - Copies your modified template.json with English translations
  - Inherits all other configurations from the base image

  2. build-backend-oem.ps1 (PowerShell build script)

  - Easy way to build the image with a custom tag
  - Provides clear success/failure feedback
  - Includes deployment instructions

  3. docker-compose-oem-backend.yml (Example configuration)

  - Shows how to modify the backend service to use your custom image
  - You can merge this with your main docker-compose.yml

  How to Use:

  1. Build the image locally:
  .\build-backend-oem.ps1
  2. Deploy to server:
  Option A - Push to registry:
  docker tag bisheng-backend-oem:latest your-registry.com/bisheng-backend-oem:latest
  docker push your-registry.com/bisheng-backend-oem:latest

## 多语言问题修复参考
  一、问题识别与定位
  1. 识别问题：
    - 某些页面或组件在语言切换后仍显示默认语言（通常是中文）
    - 硬编码的文本没有被翻译系统处理
  2. 定位问题文件：
    - 使用 Chrome DevTools 或查看页面源代码找到显示中文的组件
    - 根据页面路径找到对应的 React 组件文件
    - 例如：/log 页面对应 src/pages/LogPage/

  二、代码修复步骤

  1. 修改 React 组件：
  // 1. 导入 useTranslation hook
  import { useTranslation } from "react-i18next";

  // 2. 在组件中使用
  export default function YourComponent() {
    const { t } = useTranslation();

    // 3. 替换硬编码文本
    // 原来：placeholder="应用名称"
    // 修改：placeholder={t('log.appName')}
  }
  2. 更新翻译文件：
    - 中文：src/frontend/platform/public/locales/zh/bs.json
    - 英文：src/frontend/platform/public/locales/en/bs.json

  // 添加缺失的翻译键值对
  {
    "log": {
      "appName": "应用名称",
      "userName": "用户名",
      // ...
    }
  }

  三、构建与部署流程

  方法一：完整构建（推荐，确保所有更改生效）

  1. 使用包含源代码构建的 Dockerfile：
  docker build -f Dockerfile.frontend.oem.build -t bisheng-frontend-oem:your-tag .
  2. 关键注意事项：
    - 确保 Dockerfile 包含所有必要的依赖：
    # 复制本地包
  COPY src/frontend/platform/local-packages ./local-packages

  # 设置环境变量
  ENV NODE_ENV=production

  # 注意 vite 输出目录是 build 不是 dist
  RUN cp -r build/* /usr/share/nginx/html/platform/
  3. 更新并启动容器：
  # 1. 修改 docker-compose.yml 中的镜像标签
  # 2. 启动新容器
  docker-compose up -d frontend

  方法二：快速构建（仅适用于静态文件修改）

  # 仅复制静态文件，不重新编译 React
  docker build -f Dockerfile.frontend.oem -t bisheng-frontend-oem:your-tag .

  五、最佳实践

  1. 开发阶段：
    - 始终使用 t() 函数包装用户可见的文本
    - 避免硬编码任何需要翻译的文本
    - 及时添加翻译键值对
  2. 测试验证：
    - 测试所有语言的切换
    - 验证所有动态内容（如错误消息、提示文本）
    - 检查表单验证消息
  3. 构建优化：
    - 仅修改翻译文件：使用快速构建
    - 修改组件代码：使用完整构建
    - 保持构建环境一致性