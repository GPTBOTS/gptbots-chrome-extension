<template>
  <Card :bordered="false" class="suggest-card">
    <Form :colon="false" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }" style="margin-bottom: 50px">
      <Form.Item :label="$t('reply-suggestions.current_platform')">
        <span class="support-item">
          <img :src="currentPlatform?.icon" alt="icon" width="20" />
          {{ currentPlatform?.label }}
        </span>
      </Form.Item>
      <Form.Item :label="$t('reply-suggestions.target_user')" v-if="isSupport">
        <div class="target-user">
          <span class="target-user-avatar" v-if="globalState.userInfo.avatar">
            <img :src="globalState.userInfo.avatar" alt="avatar" />
          </span>
          <span v-if="globalState.userInfo.name" class="target-user-name">{{ globalState.userInfo.name }}</span>
          <span v-else class="no-data">{{ $t('global.no_data') }}</span>
        </div>
      </Form.Item>
      <Form.Item :label="$t('reply-suggestions.user_reply_messages')" v-if="isSupport">
        <div class="user-reply-messages" :class="{ linear: globalState.userReplyMessages.length >= 6 }">
          <div v-if="!globalState.userReplyMessages.length" class="no-data">{{ $t('global.no_data') }}</div>
          <section class="user-reply-message-item" v-for="item in globalState.userReplyMessages" :key="item">
            <div class="text">{{ item }}</div>
          </section>
        </div>
      </Form.Item>
      <Form.Item :label="$t('reply-suggestions.reply_suggestions')" v-if="isSupport">
        <div class="reply-suggestions">
          <div v-if="replySuggestion.loading" class="loading">
            <img src="@/assets/images/gptbots-logo.png" width="22" />
          </div>
          <div v-else-if="!replySuggestion.messages" class="no-data center absolute">{{ $t('global.no_data') }}</div>
          <template v-else>
            <div v-if="globalState.config.response_mode === 'streaming'">
              {{ replySuggestion.messages.map((i) => i.data).join('') }}
            </div>
            <div v-else v-for="item in replySuggestion.messages" :key="item.code">
              {{ item.data }}
            </div>
          </template>
        </div>
        <Button
          type="link"
          size="small"
          style="padding: 0"
          :disabled="!globalState.userReplyMessages.length"
          :loading="replySuggestion.loading"
          @click="generateReplySuggestions"
        >
          <i v-if="!replySuggestion.loading" class="iconfont icon-shuaxin" style="font-size: 16px" />
          <span>{{ $t('reply-suggestions.generate_reply_suggestions') }}</span>
        </Button>
      </Form.Item>
    </Form>
    <footer class="footer" v-if="isSupport">
      <Button
        :disabled="actionDisabled"
        type="primary"
        class="primary-btn"
        @click="handleReplySuggestions(ExtensionMessagteType.BotReply1)"
      >
        {{ $t('reply-suggestions.direct_reply') }}
      </Button>
      <Button :disabled="actionDisabled" @click="handleReplySuggestions(ExtensionMessagteType.BotReply2)">
        {{ $t('reply-suggestions.modify_reply') }}
      </Button>
      <Button :disabled="actionDisabled" @click="handleReplySuggestions()">
        {{ $t('reply-suggestions.not_used') }}
      </Button>
    </footer>
    <div v-if="!isSupport" class="no-data center">
      <img src="@/assets/images/no-support.png" alt="" width="130" height="130" />
      <div class="title">{{ $t('reply-suggestions.current_platform_unsupported') }}</div>
      <div class="subtitle">
        {{ $t('reply-suggestions.only_support_platforms') }}
        <img :src="item.icon" width="20px" v-for="item in supportPlatforms.filter((i) => i.support)" :key="item.host" />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card, Form, Button } from 'ant-design-vue';
import { ExtensionMessagteType } from '@/types/default';
import { globalState, isSupport } from '@/hooks/use-global-data';
import { supportPlatforms } from '@/config.options';
import { useReply } from './use-reply';

const { currentPlatform, replySuggestion, actionDisabled, handleReplySuggestions, generateReplySuggestions } =
  useReply();
</script>

<style scoped lang="less">
.suggest-card {
  position: relative;
  height: 100%;
  padding-bottom: 100px;
}

.target-user {
  display: flex;
  align-items: center;

  .target-user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .target-user-name {
    margin-left: 10px;
    font-size: 14px;
    color: #253044;
  }
}

.user-reply-messages {
  max-height: 220px;
  overflow-y: auto;

  &.linear {
    &::before {
      content: '';
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 0;
      margin-top: -10px;
      width: calc(100% - 12px);
      height: 28px;
      background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.99) 51%, rgba(255, 255, 255, 0.33) 100%);
    }

    &::after {
      content: '';
      pointer-events: none;
      position: absolute;
      bottom: 0;
      left: 0;
      width: calc(100% - 12px);
      height: 28px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.33) 100%, rgba(255, 255, 255, 0.99) 51%, #ffffff 0%);
    }
  }

  .user-reply-message-item {
    &+.user-reply-message-item {
      margin-top: 8px;
    }

    .text {
      font-size: 13px;
      display: inline-block;
      line-height: 20px;
      padding: 6px 12px;
      border-radius: 6px;
      color: rgba(37, 48, 68, 0.84);
      background: #f6f8fa;
      cursor: pointer;

      &:hover {
        color: @primary-color;
      }
    }
  }
}

.reply-suggestions {
  position: relative;
  min-height: 160px;
  background: #ffffff;
  border-radius: 6px 6px 6px 6px;
  border: 1px solid #dcdee1;
  margin-bottom: 12px;
  padding: 8px 10px;
  word-wrap: break-word;

  .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    animation: 0.870874s linear 0s infinite normal forwards running heartbeat;
  }
}

@keyframes heartbeat {
  0.00% {
    transform: translate(0px, 0px) rotate(0deg) scale(1, 1) skew(0deg, 0deg);
    opacity: 1;
  }

  2.00% {
    animation-timing-function: cubic-bezier(0.2, 0.39, 0.5, 0.97);
    transform: translate(0px, -2.16px) rotate(0deg);
  }

  36.00% {
    animation-timing-function: cubic-bezier(0.5, 0.03, 0.8, 0.61);
    transform: translate(0px, -30px) rotate(0deg);
  }

  72.00% {
    transform: translate(0px, -0.24px) rotate(0deg);
  }

  74.00% {
    animation-timing-function: cubic-bezier(0.24, 0.43, 0.48, 0.91);
    transform: translate(0px, 0px) rotate(0deg) scale(1, 0.9);
  }

  86.00% {
    animation-timing-function: cubic-bezier(0.53, 0.08, 0.77, 0.57);
    transform: translate(0px, 0px) rotate(0deg) scale(1, 0.8);
  }

  100.00% {
    animation-timing-function: cubic-bezier(0.53, 0.08, 0.77, 0.57);
    transform: translate(0px, 0px) rotate(0deg) scale(1, 1);
  }
}

.no-data {
  color: rgba(37, 48, 68, 0.32);
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 400;
  font-size: 14px;

  &.absolute {
    position: absolute;
  }

  &.center {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .title {
    margin: 12px 0 6px;
    color: rgba(37, 48, 68, 0.84);
  }

  .subtitle {
    font-size: 12px;
    color: rgba(37, 48, 68, 0.52);

    img {
      margin-left: 8px;
    }
  }
}

.footer {
  position: fixed;
  bottom: 0;
  left: 16px;
  padding-top: 4px;
  padding-bottom: 20px;
  width: calc(100% - 32px);
  display: flex;
  justify-content: space-between;
  background: #fff;
  z-index: 100;

  :deep(.ant-btn) {
    flex: 1;

    &+.ant-btn {
      margin-left: 10px;
    }
  }
}
</style>
