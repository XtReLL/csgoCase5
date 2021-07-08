import {wait} from './index'

export type LimiterType = () => Promise<any>

export class RateLimitQueue {
    protected queue: Array<LimiterType> = []
    protected isRunning = false

    constructor(
        protected limiter: () => Promise<any>,
        protected useSyncCycle = true,
    ) {
    }

    public async runCycle() {
        if (this.isRunning) return
        this.isRunning = true

        let task
        // eslint-disable-next-line no-cond-assign
        while (task = this.queue.pop()) {
            await this.limiter()
            if (this.useSyncCycle)
                await task()
            else
                task().then()
        }

        this.isRunning = false
    }

    public add<T>(work: () => Promise<T>): Promise<T> {
        const promise = new Promise<T>((resolve, reject) => {
            this.queue.push(async () => {
                try {
                    resolve(await work())
                } catch (e) {
                    reject(e)
                }
            })
        })

        this.runCycle().then()

        return promise
    }
}

export function makeLimiterWorkPerSecond(limit: number): LimiterType {
    return makeLimiterWorkPerTime(limit, 1000)
}

export function makeLimiterWorkPerTime(limit: number, ms: number): LimiterType {
    let currentRuns = 0
    let firstTrigger = 0
    return async function () {
        if (!firstTrigger) firstTrigger = Date.now()
        if (++currentRuns > limit) {
            const diff = Date.now() - firstTrigger
            if (diff <= ms) {
                await wait(ms - diff)
                currentRuns = 1
                firstTrigger = Date.now()
            }
        }
    }
}

export function makeLimiterFromLimiters(limiters: Array<LimiterType>): LimiterType {
    return async () => Promise.all(limiters.map(l => l()))
}
