// 同时进行过多的并发请求可能会导致服务器过载或浏览器性能问题。

/**
 * 控制并发请求的函数
 * @param {Array<Function>} tasks - 一个包含所有请求的函数数组，每个函数返回一个 Promise
 * @param {number} limit - 最大并发数
 * @returns {Promise<Array>} - 返回一个 Promise，在所有请求完成后 resolve
 */
function promiseAllWithConcurrencyLimit(tasks, limit) {
  let index = 0; // 当前处理任务的索引
  const results = new Array(tasks.length); // 存储结果
  const executing = new Set(); // 存储正在执行的任务

  // 定义处理下一个任务的函数
  const runNext = () => {
    if (index >= tasks.length) {
      return Promise.resolve(); // 所有任务已经处理完
    }

    const taskIndex = index++; // 获取当前任务索引，并将全局索引递增
    const task = tasks[taskIndex]; // 获取当前任务

    const promise = Promise.resolve(task()).then((result) => {
      results[taskIndex] = result; // 将结果存储到对应位置
      executing.delete(promise); // 从正在执行的任务中删除
    });

    executing.add(promise); // 将当前任务添加到正在执行的任务中

    // 继续处理下一个任务
    const next = promise.then(() => runNext());

    return Promise.race([
      next,
      executing.size >= limit && Promise.all(executing),
    ]);
  };

  // 开始执行前 limit 个任务
  const promises = Array(Math.min(limit, tasks.length)).fill().map(runNext);

  // 返回一个在所有任务完成后 resolve 的 Promise
  return Promise.all(promises).then(() => results);
}

// 示例用法

// 创建请求任务，每个请求返回一个 Promise
const createRequestTask = (url) => () =>
  fetch(url).then((response) => response.json());

const urls = [
  "https://api.example.com/data1",
  "https://api.example.com/data2",
  "https://api.example.com/data3",
  "https://api.example.com/data4",
  // 更多 URL
];

// 将每个 URL 转换为请求任务
const tasks = urls.map(createRequestTask);

// 设置最大并发请求数
const maxConcurrency = 2;

// 开始处理所有任务
promiseAllWithConcurrencyLimit(tasks, maxConcurrency)
  .then((results) => {
    console.log("所有请求已完成:", results);
  })
  .catch((error) => {
    console.error("请求出错:", error);
  });
