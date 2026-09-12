# Square avatars / 方形头像

Version 1.1.0 enables LobeHub square avatars by default. Existing `bark_url` and `device_key` settings require no changes. An explicit configured `notification.icon` still wins; `null` or `""` disables it.

1.1.0 默认启用 LobeHub 方形头像，原有地址和密钥配置无需修改。显式设置的 `notification.icon` 优先级更高，设为 `null` 或 `""` 可关闭头像。

## Source and shape / 来源与形状

The pinned package is `@lobehub/icons-static-png@1.97.0`, using `light/<slug>.png`. All 19 selected images are 640×640 PNG logos. These are LobeHub's square brand images, not the dedicated Avatar component's colored-background renderings. No `square` query parameter is needed.

固定使用 `@lobehub/icons-static-png@1.97.0` 的 `light/<slug>.png`，19 张所选图片均为 640×640 PNG 品牌图标。图片为方形，但并非 Avatar 组件带专用背景配色的渲染结果，无需添加 `square` 参数。

The initial implementation used `@lobehub/icons-static-avatar@1.14.0/avatars/<slug>.webp`. Device comparisons found that Bark's example JPEG and LobeHub's Codex PNG displayed, while the same Codex WebP failed from both UNPKG and jsDelivr. Defaults therefore use PNG. This identifies a problem with the tested WebP delivery/display path; it does not prove that every WebP fails on every iOS/Bark version.

初版使用 `@lobehub/icons-static-avatar@1.14.0/avatars/<slug>.webp`。真机对照结果：Bark 示例 JPEG 与 LobeHub Codex PNG 能显示，而同一 Codex WebP 在 UNPKG、jsDelivr 两个来源下均未显示，因此默认改用 PNG。该结果定位到所测 WebP 的下载/显示链路，不代表所有 iOS/Bark 版本都无法使用任何 WebP。

Example / 示例：

```text
https://unpkg.com/@lobehub/icons-static-png@1.97.0/light/claudecode.png
```

Sources / 来源：

- [Published package file inventory / 发布包目录](https://unpkg.com/@lobehub/icons-static-png@1.97.0/?meta)
- [LobeHub PNG exporter / PNG 导出器](https://github.com/lobehub/lobe-icons/blob/master/scripts/svgWorkflow/index.tsx)
- [Pi Agent identity / Pi 头像的产品归属](https://github.com/lobehub/lobe-icons/blob/master/src/Pi/index.mdx) — identifies `pi.dev`, not the unrelated Pi chatbot / 对应 `pi.dev`，不是其他同名聊天产品。

## Coverage / 覆盖范围

Verified against the 23 canonical kinds printed by Herdr **0.9.0** `herdr agent start --help` on 2026-09-13. **19/23 have a corresponding product or brand avatar; this is not 23/23 dedicated CLI logos.** Parent-brand mappings are noted below. The remaining four use Bark's default icon unless the user configures a custom/global one. Future Herdr kinds are not automatically guaranteed coverage.

2026-09-13 按本机 Herdr **0.9.0** 的 23 种标准 Agent 核验：**19/23 有对应产品或品牌头像，并非 23/23 都有独立 CLI 图标**。使用品牌头像的项目在下表注明。其余四种使用 Bark 默认图标，或用户配置的自定义/全局图标；不保证未来新增 Agent 自动有头像。

| Herdr ID | Agent | LobeHub icon slug | Mapping / 映射 |
| --- | --- | --- | --- |
| `pi` | Pi | `pi` | Product / 产品 |
| `claude` | Claude Code | `claudecode` | Product / 产品 |
| `codex` | Codex | `codex` | Product / 产品 |
| `gemini` | Gemini CLI | `geminicli` | Product / 产品 |
| `cursor` | Cursor Agent | `cursor` | Cursor brand / 品牌 |
| `devin` | Devin CLI | `devin` | Devin brand / 品牌 |
| `agy` | Antigravity CLI | `antigravity` | Antigravity brand / 品牌 |
| `cline` | Cline | `cline` | Product / 产品 |
| `omp` | OMP | — | Unavailable / 暂无 |
| `mastracode` | MastraCode | `mastra` | Mastra brand / 品牌 |
| `opencode` | OpenCode | `opencode` | Product / 产品 |
| `copilot` | GitHub Copilot CLI | `githubcopilot` | GitHub Copilot brand / 品牌 |
| `kimi` | Kimi Code CLI | `kimi` | Kimi brand / 品牌 |
| `kiro` | Kiro CLI | `kiro` | Kiro brand / 品牌 |
| `droid` | Droid | — | Unavailable / 暂无 |
| `amp` | Amp | `amp` | Product / 产品 |
| `grok` | Grok CLI | `grok` | Grok brand / 品牌 |
| `hermes` | Hermes Agent | `hermesagent` | Product / 产品 |
| `kilo` | Kilo Code CLI | `kilocode` | Kilo Code brand / 品牌 |
| `qodercli` | Qoder CLI | `qoder` | Qoder brand / 品牌 |
| `qwen` | Qwen Code | `qwen` | Qwen brand / 品牌 |
| `maki` | Maki | — | Unavailable / 暂无 |
| `muse` | Muse | — | Unavailable / 暂无 |

Built-in name/avatar aliases: `claude-code`, `claude_code`, `gemini-cli`, `cursor-agent`, `antigravity`, `github-copilot`, `kimi-code`, `kilo-code`, `qoder`, `qwen-code`, `hermes-agent`. These resolve only built-in defaults. User `agents` configuration still matches the exact raw event ID, and a custom `display_agent` does not change the selected avatar.

内置名称/头像支持上列别名；用户 `agents` 配置仍按事件原始 ID 精确匹配，自定义显示名称不会改变头像归属，避免改名后误用其他 Agent 的图标。

## Override or disable / 覆盖或关闭

Merge this into your existing config to disable all default avatars / 将以下字段合并到已有配置即可关闭全部默认头像：

```json
{
  "notification": { "icon": null }
}
```

Or override a single agent, for example one currently missing an avatar / 也可单独为缺少头像的 Agent 设置图标：

```json
{
  "agents": {
    "droid": {
      "notification": { "icon": "https://your-domain.example/icons/droid.png" }
    }
  }
}
```

The example domain above is a placeholder. Default avatars are the first layer of notification settings, so existing global, status, agent and agent-status override precedence is unchanged.

以上域名为占位符。默认头像处于通知设置的最底层，原有全局、状态、Agent、Agent 状态的覆盖优先级不变。

## Delivery and validation / 展示与验证

Bark downloads the image on the iPhone. Its current notification extension uses Kingfisher, whose documentation supports static WebP on iOS 14+. However, Bark caches `originalData` and passes those original bytes to Apple's `INImage(imageData:)`; Kingfisher support alone does not establish that the notification avatar will render. Bark's custom notification icon path runs on iOS 15+. The tested Codex WebP did not display on the receiving iPhone; the PNG did.

Bark 在 iPhone 上下载图像。当前通知扩展使用 Kingfisher，其文档说明 iOS 14+ 支持静态 WebP。但 Bark 缓存的是 `originalData`，并将原始字节交给 Apple 的 `INImage(imageData:)`；下载库支持 WebP，不能单独证明通知头像也能显示。Bark 自定义通知图标代码在 iOS 15+ 执行，所测 Codex WebP 在接收端 iPhone 未显示，而 PNG 能显示。

- [Bark image downloader / 图片下载实现](https://github.com/Finb/Bark/blob/master/NotificationServiceExtension/Processor/ImageDownloader.swift)
- [Bark notification icon / 通知图标实现](https://github.com/Finb/Bark/blob/master/NotificationServiceExtension/Processor/IconProcessor.swift)
- [Kingfisher WebP support / WebP 支持说明](https://github.com/onevcat/Kingfisher/wiki/FAQ#can-i-load-some-special-image-format-like-webp)

The source image is square, but iOS controls the final notification avatar mask; a square source does not guarantee a square outline on the lock screen. The URL must be reachable from the phone. If download/decode fails, Bark's implementation returns the original notification. Updating an image should use a new URL because Bark caches images by URL.

源文件是方形，但最终通知头像由 iOS 决定裁切样式，不能保证锁屏上呈现完整方形外框。手机必须能访问图片 URL；下载或解码失败时，Bark 的实现保留原通知。更新图片应使用新 URL，因为 Bark 按 URL 缓存图片。

All 19 mapped URLs were fetched successfully (HTTP 200, valid PNG signatures and 640×640 dimensions). Automated tests cover the 23-agent inventory, missing and unknown agents, aliases, identity selection, defaults for both statuses, custom overrides, and disabling icons. Tests do not fetch CDN assets during normal `npm test`.

已逐一下载验证 19 个映射地址：均为 HTTP 200、有效 PNG 文件签名及 640×640 尺寸。自动化测试覆盖 23 种清单、缺失及未知 Agent、别名、身份选择、两种状态默认图标、自定义覆盖及关闭。普通 `npm test` 不访问 CDN。

### When an icon does not appear / 图标未显示时

1. Run `herdr plugin list --plugin herdr.bark-notify` to verify the installed source. Preview with the active configuration and inspect the `icon` field; preview does not send a push. Check every notification override layer for `icon: null` or an empty string.
2. Open that image URL in Safari on the receiving iPhone using its current network. A successful download on the sending computer does not verify phone connectivity or notification rendering. Bark's current image download timeout is 10 seconds.
3. Compare a new notification using a known JPEG/PNG URL, such as the JPEG in [Bark's official tutorial](https://github.com/Finb/Bark/blob/master/docs/tutorial.md). Observe the lock screen or notification center. If it works, investigate the original image's host and format; changing both at once does not isolate which caused the failure. If it also fails, check the Bark/iOS versions and whether the self-hosted backend forwards `icon` and enables the notification service extension.

1. 用 `herdr plugin list --plugin herdr.bark-notify` 核实安装来源，使用实际配置预览并检查 `icon` 字段；预览不会发送通知。检查各层通知覆盖是否设置了 `icon: null` 或空字符串。
2. 在接收通知的 iPhone 上，用当前网络通过 Safari 打开同一图片地址。发送电脑能下载，不代表手机能访问或通知能显示。Bark 当前图片下载超时为 10 秒。
3. 使用已知 JPEG/PNG 地址发送一条新通知作对照，例如 [Bark 官方教程](https://github.com/Finb/Bark/blob/master/docs/tutorial.md) 中的 JPEG，并观察锁屏或通知中心。如果能显示，继续排查原图片的域名和格式；同时更换二者不能区分具体原因。如果也不显示，检查 Bark/iOS 版本，以及自建后端是否传递 `icon`、启用通知服务扩展。
