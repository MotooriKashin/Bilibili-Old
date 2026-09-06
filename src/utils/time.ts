/**
 * 将时间格式化为 hh:mm:ss 格式
 * 
 * @param item 要格式化的时间
 * @returns 格式化的时间
 * @example
 * durationFormat({seconds:123}) // 02:03
 * durationFormat({ milliseconds: 12345678 }) // 03:25:46
 */
export function durationFormat(item: string | Temporal.Duration | Temporal.DurationLike,) {
    return Temporal.Duration.from(item).round({ largestUnit: 'hour', smallestUnit: 'second' }).toLocaleString(undefined, {
        style: 'digital',
        hours: '2-digit',
        hoursDisplay: 'auto',
        minutes: '2-digit',
        seconds: '2-digit',
    });
}

/**
 * 将 Unix epoch 格式化为相对时间（如：5分钟前）或绝对日期
 * 
 * @param epochMS 从 Unix epoch 以来的毫秒数
 * @param options 格式化使用格式。默认 yyyy-MM-dd hh:mm:ss
 * @returns 格式化的时间字符串
 */
export function epochFormat(
    epochMS: number,
    options: globalThis.Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false },
) {
    const target = Temporal.Instant.fromEpochMilliseconds(epochMS);
    const now = Temporal.Now.instant();

    // 1. 先计算总小时差（Instant 支持的最大单位是 hours）
    const diffInHours = target.since(now, { largestUnit: 'hour' });

    // 2. 如果绝对值超过 24 小时，直接走绝对时间格式化
    if (Math.abs(diffInHours.hours) >= 24) {
        return target.toLocaleString(undefined, options).replaceAll('/', '-');
    }

    // 3. 24 小时以内的，使用 Intl.RelativeTimeFormat 格式化
    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

    // 重新计算详细差值（包含秒、分、时）
    const preciseDiff = target.since(now, {
        largestUnit: 'hour',
        smallestUnit: 'second',
        roundingMode: 'trunc'
    });

    if (Math.abs(preciseDiff.hours) >= 1) {
        return rtf.format(preciseDiff.hours, 'hour');
    } else if (Math.abs(preciseDiff.minutes) >= 1) {
        return rtf.format(preciseDiff.minutes, 'minute');
    } else {
        return rtf.format(preciseDiff.seconds, 'second');
    }
}

type TimeUnit = 'year' | 'month' | 'day';

/**
 * 将输入的时间戳转为相对于当前时刻的格式化字符串
 * 
 * @param timestamp - 毫秒级 Unix 时间戳（如 Date.now()）
 * @param locale - 语言环境，默认使用环境/浏览器当前语言
 * @returns 格式化后的相对时间字符串，如 "今天"、"昨天"、"3个月前"、"2年后"
 */
export function epochRelativeTime(
    timestamp: number,
    locale?: string | string[]
): string {
    // 1. 获取当前时间与目标时间的 Temporal.Instant
    const targetInstant = Temporal.Instant.fromEpochMilliseconds(timestamp);
    const nowInstant = Temporal.Now.instant();

    // 2. 转换为系统本地时区的 ZonedDateTime，方便按日历单位（年/月/日）进行对比
    const timeZone = Temporal.Now.timeZoneId();
    const targetZdt = targetInstant.toZonedDateTimeISO(timeZone);
    const nowZdt = nowInstant.toZonedDateTimeISO(timeZone);

    // 3. 提取日期部分，排除具体时分秒对“天”计算的干扰（例如昨晚 11 点到今天早晨 1 点算“昨天”）
    const targetDate = targetZdt.toPlainDate();
    const nowDate = nowZdt.toPlainDate();

    // 4. 计算 PlainDate 之间的精确差距
    const duration = nowDate.until(targetDate, {
        largestUnit: 'year',
        smallestUnit: 'day',
    });

    // 5. 判断最大可用单位（优先按 年 -> 月 -> 天）
    let unit: TimeUnit = 'day';
    let value = duration.days;

    if (Math.abs(duration.years) >= 1) {
        unit = 'year';
        value = duration.years;
    } else if (Math.abs(duration.months) >= 1) {
        unit = 'month';
        value = duration.months;
    }

    // 6. 使用 Intl.RelativeTimeFormat 进行本地化格式化
    // numeric: 'auto' 会自动将 -1 转换为 "昨天"，0 转换为 "今天"，1 转换为 "明天"
    const rtf = new Intl.RelativeTimeFormat(locale, {
        numeric: 'auto',
        style: 'long',
    });

    return rtf.format(value, unit);
}