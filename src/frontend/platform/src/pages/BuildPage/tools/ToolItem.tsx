import { TitleIconBg } from "@/components/bs-comp/cardComponent";
import { SettingIcon } from "@/components/bs-icons/setting";
import { ToolIcon } from "@/components/bs-icons/tool";
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/bs-ui/accordion";
import { Badge } from "@/components/bs-ui/badge";
import { Button } from "@/components/bs-ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/bs-ui/tooltip";
import { CircleHelp } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// Map Chinese tool names to translation keys
const getToolTranslationKey = (toolName) => {
    const toolMap = {
        'Dalle3绘画': 'build.tools.dalle3',
        'Firecrawl': 'build.tools.firecrawl',
        'Jina AI': 'build.tools.jina',
        'SiliconFlow': 'build.tools.siliconflow',
        '发送邮件': 'build.tools.email',
        '飞书消息': 'build.tools.lark',
        'Lark': 'build.tools.lark',
        'Bing web搜索': 'build.tools.bing',
        '天眼查': 'build.tools.tianyancha',
        '联网搜索': 'build.tools.websearch',
        '代码执行器': 'build.tools.codeExecutor',
        '时间': 'build.tools.time',
        '计算器': 'build.tools.calculator',
        '论文获取': 'build.tools.paper',
        '钉钉': 'build.tools.dingding',
        '企业微信': 'build.tools.wechat',
        '经济金融数据': 'build.tools.economic'
    };
    return toolMap[toolName] || toolName;
};

// Map Chinese tool descriptions to translation keys
const getToolDescriptionTranslationKey = (toolName, description) => {
    // Use description as key if we don't have a specific mapping
    const descMap = {
        'Dalle3绘画': 'build.toolDescriptions.dalle3',
        'Firecrawl': 'build.toolDescriptions.firecrawl',
        'Jina AI': 'build.toolDescriptions.jina',
        'SiliconFlow': 'build.toolDescriptions.siliconflow',
        '发送邮件': 'build.toolDescriptions.email',
        '飞书消息': 'build.toolDescriptions.lark',
        'Lark': 'build.toolDescriptions.lark',
        'Bing web搜索': 'build.toolDescriptions.bing',
        '天眼查': 'build.toolDescriptions.tianyancha',
        '联网搜索': 'build.toolDescriptions.websearch',
        '代码执行器': 'build.toolDescriptions.codeExecutor',
        '时间': 'build.toolDescriptions.time',
        '计算器': 'build.toolDescriptions.calculator',
        '论文获取': 'build.toolDescriptions.paper',
        '钉钉': 'build.toolDescriptions.dingding',
        '企业微信': 'build.toolDescriptions.wechat',
        '经济金融数据': 'build.toolDescriptions.economic'
    };
    return descMap[toolName] || null;
};

// Map API tool names to translation keys
const getApiToolTranslationKey = (toolName, apiName) => {
    // Create a mapping for individual API tools using exact Chinese names
    const apiToolMap = {
        '联网搜索': 'websearch',
        '发送邮件': 'sendEmail',
        '单页面爬取|对应 Scrape 模式': 'firecrawl_scrape',
        '深度爬取|对应 Crawl 模式': 'firecrawl_crawl',
        '获取单网页': 'jina_reader',
        '向指定用户或者群聊发送消息': 'lark_send_message',
        '获取指定单聊、群聊的历史消息': 'lark_get_messages',
        '发送钉钉群消息': 'dingding_send',
        '发送企业微信群消息': 'wechat_send',
        // WeChat Work parameters
        '微信机器人的webhook地址': `toolParam.wechat_send.url`,
        '发送的消息内容': `toolParam.wechat_send.message`,
        'Dalle3绘画': 'dalle3',
        'Bing web搜索': 'bing',
        '时间': 'get_current_time',
        // SiliconFlow parameters
        '提示词生成图片描述词': `toolParam.siliconflow.prompt`,
        '不希望图片包含的内容': `toolParam.siliconflow.negative_prompt`,
        '计算器': 'calculator',
        '论文获取': 'paper',
        '代码执行器': 'code_interpreter',
        // Tianyancha tools
        '人员所有公司': 'tianyancha_all_companys',
        '搜索企业': 'tianyancha_search_company',
        '企业基本信息': 'tianyancha_base_info',
        '企业知识产权信息': 'tianyancha_ip_info',
        '企业司法风险': 'tianyancha_judicial_risk',
        '企业法律诉讼': 'tianyancha_litigation',
        '企业工商信息': 'tianyancha_business_info',
        '企业工商信息变更记录': 'tianyancha_business_changes',
        '企业股东': 'tianyancha_shareholders',
        '企业天眼风险': 'tianyancha_risks',
        // Economic data tools
        '股票实时行情': 'stock_realtime',
        '股票历史行情': 'stock_history',
        '社会融资规模增量': 'social_financing',
        '货币供应量': 'money_supply',
        '社会消费品零售总额': 'retail_sales',
        '中美国债收益率': 'bond_yield'
    };

    return apiToolMap[apiName] || apiName;
};

// Get the translation key for API tool name
const getApiToolNameTranslationKey = (parentToolName, apiName) => {
    const apiKey = getApiToolTranslationKey(parentToolName, apiName);
    return `toolApi.${apiKey}.name`;
};

// Get the translation key for API tool description
const getApiToolDescTranslationKey = (parentToolName, apiName) => {
    const apiKey = getApiToolTranslationKey(parentToolName, apiName);
    return `toolApi.${apiKey}.desc`;
};

// Get translation key for parameter descriptions
const getParamDescTranslationKey = (parentToolName, apiName, paramName, paramDesc) => {
    // Create a mapping for known Chinese parameter descriptions
    const paramDescMap = {
        '接受邮件的邮箱地址，确定邮件发送对象': `toolParam.sendEmail.receiver`,
        '邮件主题，邮件内容的概括': `toolParam.sendEmail.subject`,
        '邮件主题': `toolParam.sendEmail.subject`,
        '邮件的具体内容': `toolParam.sendEmail.content`,
        '邮件的正文内容': `toolParam.sendEmail.content`,
        '搜索查询的关键词': `toolParam.websearch.query`,
        '要抓取的网页URL': `toolParam.jina_reader.url`,
        '要爬取的起始URL': `toolParam.firecrawl.url`,
        '发送消息的文本内容': `toolParam.lark_send_message.content`,
        '接收者的用户ID或邮箱': `toolParam.lark_send_message.receiver`,
        '群聊ID': `toolParam.lark_get_messages.chat_id`,
        '需要计算的数学表达式': `toolParam.calculator.expression`,
        '论文搜索的关键词': `toolParam.arxiv_search.query`,
        '查询的公司名称': `toolParam.tianyancha.company_name`,
        '要执行的Python代码': `toolParam.code_executor.code`,
        '图片生成的描述文本': `toolParam.dalle3.prompt`,
        '图片的尺寸大小': `toolParam.dalle3.size`,
        '图片生成的质量': `toolParam.dalle3.quality`,
        // Lark Message parameters
        '发送的文本消息内容': `toolParam.lark_send_message.content`,
        '消息接收者的id': `toolParam.lark_send_message.receive_id`,
        '用户id类型，可选值：open_id（标识一个用户在某个应用中的身份）；union_id（标识一个用户在某个应用开发商下的身份）；user_id（标识一个用户在某个租户内的身份）；email（以用户的真实邮箱来标识用户）；chat_id（以群 ID 来标识群聊）': `toolParam.lark_send_message.receive_id_type`,
        // Lark Get Messages parameters
        '单聊或群聊的id，或话题 id': `toolParam.lark_get_messages.container_id`,
        '容器类型。 可选值有： chat：包含单聊（p2p）和群聊（group）； thread：话题 。': `toolParam.lark_get_messages.container_id_type`,
        '待查询历史信息的起始时间，秒级时间戳。 注意：thread 容器类型暂不支持获取指定时间范围内的消息。': `toolParam.lark_get_messages.start_time`,
        '待查询历史信息的结束时间，秒级时间戳。注意：thread 容器类型暂不支持获取指定时间范围内的消息。': `toolParam.lark_get_messages.end_time`,
        '分页大小，单次请求所返回的数据条目数，默认值20，取值范围1~50。': `toolParam.lark_get_messages.page_size`,
        '可选值有：ByCreateTimeAsc（按消息创建时间升序排列）；ByCreateTimeDesc（按消息创建时间降序排列）': `toolParam.lark_get_messages.sort_type`,
        '分页标记，第一次请求不填，表示从头开始遍历；分页查询结果还有更多项时会同时返回新的 page_token，下次遍历可采用该 page_token 获取查询结果': `toolParam.lark_get_messages.page_token`,
        // WeChat Work parameters
        '微信机器人的webhook地址': `toolParam.wechat_send.url`,
        '发送的消息内容': `toolParam.wechat_send.message`,
        // SiliconFlow parameters
        '提示词生成图片描述词': `toolParam.siliconflow.prompt`,
        '不希望图片包含的内容': `toolParam.siliconflow.negative_prompt`,
        // DingTalk parameters
        '自定义机器人的Wehhook地址': `toolParam.dingtalk.webhook`,
        '发送的文本消息内容': `toolParam.dingtalk.content`,
        // Jina Reader parameters
        '要获取的目标网页': `toolParam.jina_reader.url`,
        // Firecrawl parameters
        '要爬取的起始URL': `toolParam.firecrawl.url`,
        // Tianyancha parameters
        '搜索关键字（公司名称、公司id、注册号或社会统一信用代码）': `toolParam.tianyancha.query`,
        // Stock Market parameters
        '前缀。如果是\"stock_symbol\"传入的为股票代码，则需要传入s_;\\n如果\"stock_symbol\"传入的为指数代码，则为空。': `toolParam.stock.prefix`,
        '交易所简写。股票上市的交易所，或者发布行情指数的交易所。可选项有\"sh\"(上海证券交易所)、\" sz\"( 深圳证券交易所)、\"bj\"( 北京证券交易所)': `toolParam.stock.stock_exchange`,
        '6位数字的股票或者指数代码。\\n参考信息：\\n- 如果问题中未给出，可能需要上网查询。\\n- 上交所股票通常以 6 开头，深交所股票通常以 0、3 开头，北交所股票通常以 8 开头。\\n- 上交所行情指数通常以 000 开头，深交所指数通常以 399 开头。同一个指数可能会同时在两个交易所发布，例如沪深 300 有\"sh000300\"和\"sz399300\"两个代码。': `toolParam.stock.stock_symbol`,
        '需要查询的时间，按照\"2024-03-26\"格式，传入日期': `toolParam.stock.date`,
        // Economic Data parameters
        '开始月份, 使用YYYY-MM-DD 方式表示': `toolParam.economic.start_date`,
        '结束月份, 使用YYYY-MM-DD 方式表示': `toolParam.economic.end_date`,
    };

    return paramDescMap[paramDesc] || null;
};

// Map Chinese tool descriptions to translation keys for Economic Financial Data tools
const getEconomicToolDescTranslationKey = (toolDesc) => {
    const economicDescMap = {
        '中国 PMI （采购经理人指数）月度统计数据。返回数据包括：月份制造业 PMI，制造业 PMI 同比增长，非制造业 PMI，非制造业 PMI 同比增长。': 'economicToolDescriptions.pmi',
        '中国工业品出厂价格指数（PPI）月度统计数据。返回数据包括：月份，当月 PPI，当月同比增长，当年 PPI 累计值。': 'economicToolDescriptions.ppi',
        '中国居民消费价格指数(CPI，上年同月=100)月度统计数据。返回数据包括：月份，全国当月 CPI，全国当月同比增长，全国当月环比增长，全国当年 CPI 累计值；城市当月 CPI，城市当月同比增长，城市当月环比增长，城市当年 CPI 累计值；农村当月 CPI，农村当月同比增长，农村当月环比增长，农村当年 CPI 累计值。': 'economicToolDescriptions.cpi',
        '中国国内生产总值（GDP）季度统计数据。返回数据包括：季度，当年累计GDP 绝对值及同比增长情况，第一、二、三产业 GDP 绝对值以及同比增长情况。': 'economicToolDescriptions.gdp'
    };
    return economicDescMap[toolDesc] || null;
};

export default function ToolItem({
    type,
    select,
    data,
    onEdit = (id) => { },
    onSelect,
    onSetClick = null
}) {
    const { t } = useTranslation();
    const sortData = useMemo(() => {
        const { children, is_preset } = data;
        if (children) {
            return is_preset === 2 ? children.sort((a, b) => a.id - b.id) : children;
        }
        return [];
    }, [data.children]);

    return <AccordionItem key={data.id} value={data.id} className="data-[state=open]:border-2 data-[state=open]:border-primary/20 data-[state=open]:rounded-md">
        <AccordionTrigger className="min-w-0">
            <div className="group flex gap-2 text-start relative pr-4 min-w-0">
                <TitleIconBg className="w-8 h-8 min-w-8" id={data.id} ><ToolIcon /></TitleIconBg>
                <div className="flex-1 min-w-0">
                    <div className="w-full text-sm font-medium leading-none flex items-center gap-2 min-w-0">
                        <span className="truncate">
                            {getToolTranslationKey(data.name).startsWith('build.tools.') ? t(getToolTranslationKey(data.name)) : data.name}
                        </span>
                        {
                            ['edit', 'mcp'].includes(type) && data.write && <div
                                className="group-hover:opacity-100 opacity-0 hover:bg-[#EAEDF3] rounded cursor-pointer"
                                onClick={(e) => onEdit(data.id)}
                            ><SettingIcon /></div>
                        }
                        {
                            onSetClick && data.write &&!['mcp'].includes(type)&& <div
                                className="group-hover:opacity-100 opacity-0 hover:bg-[#EAEDF3] rounded cursor-pointer"
                                onClick={onSetClick}
                            ><SettingIcon /></div>
                        }
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        {(() => {
                            const descKey = getToolDescriptionTranslationKey(data.name, data.description);
                            return descKey ? t(descKey) : data.description;
                        })()}
                    </p>
                </div>
            </div>
        </AccordionTrigger>
        <AccordionContent className="">
            <div className="px-6 mb-4">
                {sortData.map(api => (
                    <div key={api.name} className="relative p-4 rounded-sm  border-t">
                        <h1 className="text-sm font-medium leading-none">
                            {(() => {
                                const nameKey = getApiToolNameTranslationKey(data.name, api.name);
                                // Check if the translation exists
                                const translated = t(nameKey);
                                return translated !== nameKey ? translated : api.name;
                            })()}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-2">
                            {(() => {
                                // First check if it's an Economic Financial Data tool with Chinese description
                                if (data.name === '经济金融数据') {
                                    const economicDescKey = getEconomicToolDescTranslationKey(api.desc);
                                    if (economicDescKey) {
                                        return t(economicDescKey);
                                    }
                                }
                                // Otherwise use the regular API tool description translation
                                const descKey = getApiToolDescTranslationKey(data.name, api.name);
                                const translated = t(descKey);
                                return translated !== descKey ? translated : api.desc;
                            })()}
                        </p>
                        {
                            api.api_params?.length > 0 && <p className="text-sm text-muted-foreground mt-2 flex gap-2">
                                <TooltipProvider>
                                    <Tooltip delayDuration={100}>
                                        <TooltipTrigger asChild>
                                            <span className="text-primary cursor-pointer flex items-center">{t("build.params")}<CircleHelp className="size-3" /></span>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="bg-gray-50 border shadow-md p-4 text-gray-950 max-w-[520px]">
                                            <p className="flex gap-2 items-center">
                                                <Badge>{JSON.parse(api.extra)?.method || 'http'}</Badge>
                                                <span className="text-xl">
                                                    {(() => {
                                                        const nameKey = getApiToolNameTranslationKey(data.name, api.name);
                                                        const translated = t(nameKey);
                                                        return translated !== nameKey ? translated : api.name;
                                                    })()}
                                                </span>
                                            </p>
                                            <p className="text-sm mt-2 text-gray-500">
                                                {(() => {
                                                    const descKey = getApiToolDescTranslationKey(data.name, api.name);
                                                    const translated = t(descKey);
                                                    return translated !== descKey ? translated : api.desc;
                                                })()}
                                            </p>
                                            {
                                                api.api_params.map(param => (
                                                    <div key={param.name}>
                                                        <p className="flex gap-2 items-center mt-4 mb-2">
                                                            <span className="text-base">{param.name}</span>
                                                            <span>{param.schema?.type}</span>
                                                            {param.required && <span className="text-red-500">{t('build.required')}</span>}
                                                        </p>
                                                        <p className="text-gray-500">
                                                            {(() => {
                                                                const paramDescKey = getParamDescTranslationKey(data.name, api.name, param.name, param.description);
                                                                return paramDescKey ? t(paramDescKey) : param.description;
                                                            })()}
                                                        </p>
                                                    </div>
                                                ))
                                            }
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                :
                                {
                                    api.api_params.map(param => (
                                        <div>
                                            <span className=" rounded-xl bg-gray-200 dark:bg-background-login px-2 py-1 text-xs font-medium">{param.name}</span>
                                            {/* <span>{param.schema.type}</span> */}
                                        </div>
                                    ))
                                }
                            </p>
                        }
                        {
                            select && (select.some(_ => _.id === api.id) ?
                                <Button size="sm" className="absolute right-4 bottom-2 h-6" disabled>{t("build.added")}</Button>
                                : <Button size="sm" className="absolute right-4 bottom-2 h-6" onClick={() => onSelect(api)}>{t("build.add")}</Button>)
                        }
                    </div>
                ))}
            </div>
        </AccordionContent>
    </AccordionItem >
}
