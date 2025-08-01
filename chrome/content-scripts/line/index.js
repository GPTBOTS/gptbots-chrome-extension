// ====== 注入到页面的脚本 =======

/**
 * 监听来自插件发送的数据
 */
chrome.runtime.onMessage.addListener(
  /** @param {import('../type').Message} e */
  function (e) {
    console.log(e);
    if (!e) return;
    try {
      if (e.type === 'Init') handleInit();
      if (e.type === 'SwitchChat') handleSwitchChat(e.data, e.channel);
      if (e.type === 'BotReply1') handleBotReply(e.data);
      if (e.type === 'BotReply2') handleBotReply(e.data, false);
    } catch (err) {
      console.error(err);
    }
  },
);

/** 处理初始化 */
function handleInit() {
  console.log('handleInit');
  let user_id = location.href.split('/chat/')[1];
  if (!user_id) return;
  if (user_id.includes('?')) user_id = user_id.split('?')[0];
  if (user_id.includes('/')) user_id = user_id.split('/')[0];
  console.log(user_id);
  const activeUser = document.querySelector('.list-group-item-chat.active');
  const name = activeUser ? activeUser.querySelector('h6.text-truncate-box').innerText : '';
  const avatar = activeUser ? activeUser.querySelector('img.avatars-one').src : '';
  chrome.runtime.sendMessage({
    type: 'Init',
    data: {
      userInfo: { user_id, name, avatar },
    },
  });
}

/**
 * 处理bot回复-修改内容
 * @param {string} data
 * @param {boolean} shouldSend 是否发送
 */
function handleBotReply(data, shouldSend = true) {
  const textareaEl = document.querySelector('#editable-unit #editor');
  if (textareaEl) {
    textareaEl.focus();
    textareaEl.click();
    textareaEl.value = data;
    // line需要用到
    document.execCommand('insertText', !1, data);
    // 触发发送
    if (shouldSend) {
      const sendBtn = document.querySelector('#editable-unit input[type="submit"][value="Send"]');
      if (sendBtn) sendBtn.click();
    }
  }
}

/**
 * 切换聊天
 * @param {string} name 用户名
 * @param {string} channel 渠道名称
 */
function handleSwitchChat(name, channel) {
  const dropdown = document.getElementById('header-user')?.querySelector('.dropdown');
  const trigger = dropdown?.querySelector('a');
  
  if (!trigger) return;
  
  trigger.click();
  
  setTimeout(() => {
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    if (!dropdownMenu) return;
    
    console.log(channel, 'channel');
    
    // 查找并点击指定渠道
    const targetChannel = Array.from(dropdownMenu.querySelectorAll('.dropdown-item'))
      .find(item => item.textContent.trim().includes(channel));
    
    if (targetChannel) {
      targetChannel.click();
      
      // 等待渠道切换后查找用户
      setTimeout(() => {
        const userList = document.querySelectorAll('.list-group-item-chat > a');
        
        const targetUser = Array.from(userList).find(item => {
          const nameEl = item.querySelector('h6.text-truncate-box');
          return nameEl?.innerText === name;
        });
        
        if (targetUser) {
          targetUser.click();
          setTimeout(() => handleInit(), 100);
        }
      }, 2000);
    }
  }, 1000);
}

const switchChat = () => {
  setTimeout(() => {
    handleInit();
    const chatlist = document.querySelector('.chatlist');
    if (chatlist) {
      chatlist.addEventListener(
        'click',
        (e) => {
          if (e.target.closest('.list-group-item')) {
            chrome.runtime.sendMessage({ type: 'SwitchChat' });
            setTimeout(() => handleInit(), 300);
          }
        },
        true,
      );
    }
  }, 2000);
}

switchChat();

// 使用事件委托监听所有 .dropdown-item 的点击事件
document.addEventListener('click', (e) => {
  if (e.target.closest('.dropdown-item')) {
    setTimeout(() => {
      switchChat()
    }, 500);
  }
}, true);

