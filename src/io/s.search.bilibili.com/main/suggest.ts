/** 获取搜索建议 */
export async function suggest(
    term: string,
    init?: RequestInit,
    userid = 49811844,
    tag_num = 10,
    special_num = 10,
    bangumi_num = 10,
    upuser_num = 3,
    topic_acc_num = 1,
    special_acc_num = 1,
    bangumi_acc_num = 1,
    upuser_acc_num = 3,
    func = ' suggest',
    suggest_type = 'accurate',
    sub_type = 'tag',
    main_ver = 'v1',
    highlight = '',
) {
    const url = new URL('https://s.search.bilibili.com/main/suggest');
    const searchParams = new URLSearchParams(<any>{ term, userid, tag_num, special_num, bangumi_num, upuser_num, topic_acc_num, special_acc_num, bangumi_acc_num, upuser_acc_num, func, suggest_type, sub_type, main_ver, highlight });
    url.search = searchParams.toString();
    const response = await fetch(url, { credentials: 'include', ...init });
    return <Promise<{ code: number; result: ISuggest; }>>response.json();
}

export interface ISuggest {
    tag: { term: string }[];
}