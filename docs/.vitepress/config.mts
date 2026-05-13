import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Claude API 中转站导航与使用指南',
  description: 'Claude API 中转站、Claude API 调用教程、Claude 模型价格说明与国内接入指南，专注 Claude API 接入与使用经验分享。',
  lastUpdated: true,
  cleanUrls: true,

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/claude-logo.svg' }],
    ['link', { rel: 'icon', type: 'image/jpeg', href: '/favicon.jpg' }],
    ['meta', { name: 'keywords', content: 'Claude API中转, Claude API中转站, Claude API调用, Claude API国内, Claude API教程, Claude模型价格, Claude API Python, Claude API Key, Claude Sonnet, Claude Opus, Claude Haiku, Claude API 接入' }],
    ['meta', { name: 'author', content: 'Claude API 中转站' }],
    ['meta', { name: 'theme-color', content: '#cf6e49' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Claude API 中转站导航与使用指南' }],
    ['meta', { property: 'og:description', content: 'Claude API 中转站、Claude API 调用教程、Claude 模型价格说明与国内接入指南' }],
    ['meta', { property: 'og:image', content: '/claude-logo.svg' }]
  ],
  
  themeConfig: {
    // Logo 配置
    logo: '/claude-logo.svg',
    siteTitle: 'Claude API 中转站',
    
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: 'Claude API 中转站', link: 'https://jeniya.cn' },
      { text: 'Claude API 教程', link: '/blog/claude-api/' },
      { text: 'API 中转专题', link: '/blog/api-middleman/' },
      { text: '免责申明', link: '/disclaimer' }
    ],

    // 侧边栏配置
    sidebar: {
      '/blog/claude-api/': [
        {
          text: '📚 Claude API 教程',
          collapsed: false,
          items: [
            { text: 'Claude API 分类首页', link: '/blog/claude-api/' },
            { text: 'Claude API 如何调用？Python 接入示例与参数说明', link: '/blog/claude-api/claude-api-python-guide' },
            { text: 'Claude API 国内怎么用？申请、接入与中转方案完整教程', link: '/blog/claude-api/claude-api-china-guide' },
            { text: 'Claude 模型版本对比：Haiku vs Sonnet vs Opus 如何选择', link: '/blog/claude-api/claude-models-comparison' },
            { text: 'Claude API 最佳实践：提示词优化与成本控制', link: '/blog/claude-api/claude-api-best-practices' },
            { text: 'Claude API 错误处理完整指南', link: '/blog/claude-api/claude-api-error-handling' }
          ]
        },
        {
          text: '📋 基础页面',
          collapsed: false,
          items: [
            { text: '支持模型', link: '/models' },
            { text: '价格说明', link: '/pricing' },
            { text: '接入文档', link: '/docs' },
            { text: '常见问题', link: '/faq' }
          ]
        }
      ],
      '/blog/api-middleman/': [
        {
          text: '🔄 API 中转专题',
          collapsed: false,
          items: [
            { text: 'API中转站分类首页', link: '/blog/api-middleman/' },
            { text: 'API中转站是什么？一篇看懂大模型 API 中转的作用与适用场景', link: '/blog/api-middleman/what-is-api-middleman' },
            { text: '大模型 API 中转和官方 API 有什么区别？开发者如何选择', link: '/blog/api-middleman/api-middleman-vs-official-api' },
            { text: 'API中转站怎么选？从稳定性、价格、并发和兼容性看这 8 个指标', link: '/blog/api-middleman/how-to-choose-api-middleman' }
          ]
        },
        {
          text: '📋 基础页面',
          collapsed: false,
          items: [
            { text: '支持模型', link: '/models' },
            { text: '价格说明', link: '/pricing' },
            { text: '接入文档', link: '/docs' },
            { text: '常见问题', link: '/faq' }
          ]
        }
      ]
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    // 大纲配置
    outline: {
      level: [2, 3],
      label: '目录'
    },

    // 文档页脚
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    // 最后更新时间
    lastUpdated: {
      text: '最后更新',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    },

    // 页脚配置
    footer: {
      message: '提供 Claude API 中转站、Claude API 调用教程、模型价格说明与国内接入指南。',
      copyright: '© 2026 Claude API 中转站导航与使用指南 ｜ <a href="/models">支持模型</a> ｜ <a href="/pricing">价格说明</a> ｜ <a href="/docs">接入文档</a> ｜ <a href="/faq">常见问题</a>'
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/edit/main/:path',
      text: '在 GitHub 上编辑此页'
    },

    // 搜索配置
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换'
            }
          }
        }
      }
    },

    // 返回顶部
    returnToTopLabel: '返回顶部',

    // 侧边栏菜单标签
    sidebarMenuLabel: '菜单',

    // 深色模式切换标签
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式'
  }
})
