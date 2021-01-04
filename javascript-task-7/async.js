'use strict';

exports.isStar = true;
exports.runParallel = runParallel;


class ThreadPool {
    constructor(jobs, threadCount) {
        this.jobs = jobs;
        this.threadCount = threadCount;
        this.timeout = Infinity;
        this.jobResults = [];
        this.jobIndex = 0;
    }


    async execute() {
        const threads = [];
        for (let i = 0; i < this.threadCount; i++) {
            threads.push(this.runThread());
        }
        for (let i = 0; i < this.threadCount; i++) {
            await threads[i];
        }

        return this.jobResults;
    }


    getNextJobIndex() {
        if (this.jobIndex >= this.jobs.length) {
            return;
        }

        return this.jobIndex++;
    }


    async runThread() {
        for (let jobIndex = this.getNextJobIndex();
            jobIndex !== undefined; jobIndex = this.getNextJobIndex()) {
            const jobPromise = this.performJobWithTimeout(this.jobs[jobIndex]);

            await jobPromise
                .then(result => {
                    this.jobResults[jobIndex] = result;
                });
        }
    }


    performJobWithTimeout(job) {

        return new Promise(resolve => {
            job().then(resolve)
                .catch(resolve);
            if (this.timeout !== Infinity) {
                setTimeout(() => resolve(new Error('Promise timeout')), this.timeout);
            }
        });
    }


    withTimeout(timeout) {
        this.timeout = timeout;
    }
}


/** Функция паралелльно запускает указанное число промисов
 * @param {Array} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    const threadCount = Math.min(parallelNum, jobs.length);
    const pool = new ThreadPool(jobs, threadCount);
    pool.withTimeout(timeout);

    return pool.execute();
}
