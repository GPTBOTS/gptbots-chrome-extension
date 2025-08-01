/** 插件缓存-都用这个，本身并不存数据，只是chrome.storage.local的封装 */
export function useStorage() {
  const storage = chrome.storage.local;

  /** 获取缓存 */
  function getStorage(key: string) {
    return new Promise<string>((resolve) => {
      storage.get(key, (result) => resolve(result[key]));
    });
  }

  /** 设置缓存
   * 注意覆盖，更新应使用updateStorage
   * value 应该格式化为json字符串 */
  function setStorage(key: string, value: string) {
    return new Promise((resolve) => {
      storage.set({ [key]: value }, () => resolve(true));
    });
  }

  /** 删除缓存 */
  function removeStorage(key: string) {
    return new Promise((resolve) => {
      storage.remove(key, () => resolve(true));
    });
  }

  /** 更新缓存 */
  async function updateStorage(key: string, value: any) {
    return new Promise((resolve) => {
      storage.set({ [key]: value }, () => resolve(true));
    });
  }

  return {
    getStorage,
    setStorage,
    removeStorage,
    updateStorage,
  };
}
