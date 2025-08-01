<template>
  <Card :bordered="false">
    <Form :colon="false" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
      <Form.Item :label="$t('assistant.serviceStatus')">
        <div class="service-status">
          <section class="status">
            <span
              class="service-status-icon"
              :class="{ 'is-stop': !serviceInfo.enabled, 'is-enabled': serviceInfo.enabled }"
            ></span>
            <span class="ripple-effect" :class="{ show: serviceInfo.enabled }"></span>
            {{ serviceInfo.enabled ? $t('assistant.serviceEnabled') : $t('assistant.serviceDisabled') }}
          </section>
          <Button
            type="link"
            size="small"
            class="action"
            :class="{ 'is-stop': !serviceInfo.enabled, 'is-enabled': serviceInfo.enabled }"
            :loading="serviceInfo.loading"
            @click="
              () => {
                serviceInfo.enabled ? handleStop() : handleStart();
              }
            "
          >
            <i class="iconfont icon-Group-470030" v-if="!serviceInfo.loading && serviceInfo.enabled" />
            <i class="iconfont icon-Frame" v-else-if="!serviceInfo.loading" />
            <span>{{ serviceInfo.enabled ? 'Stop' : 'Start' }}</span>
          </Button>
        </div>
      </Form.Item>
      <Form.Item :label="$t('assistant.sourceChannel')">
        <Cascader
            v-model:value="serviceInfo.conversation"
            size="large"
            multiple
            max-tag-count="responsive"
            :options="serviceInfo.conversationOptions"
            placeholder="ALL CHANNELS"
            class="custom-cascader"
            @change="handleChangeConversation"
          ></Cascader>
      </Form.Item>
      <Form.Item>
        <template #label>
          <span>{{ $t('assistant.pendingUsers') }}</span>
          <a v-if="pendingUsers.data.length > 0" class="label-right" @click="handleClearPendingUsers">
            <i class="iconfont icon-shuaxin" />
            <span>{{ $t('assistant.clearPendingUsers') }}</span>
          </a>
        </template>
        <div class="pending-users">
          <div class="no-data" v-if="pendingUsers.currentData.length === 0">
            <img src="@/assets/images/no-data.png" class="no-data-icon" />
            {{ $t('global.no_data') }}
          </div>
          <div
            class="pending-user-item"
            v-for="(item, index) in pendingUsers.currentData"
            :key="item.time"
            @click="handleSwitchChat(item.user_name, item.channel_name)"
          >
            <img src="@/assets/images/default-pending-user.svg" class="pending-user-item-avatar" />
            <div class="pending-user-item-info">
              <div class="pending-user-item-header">
                <div class="pending-user-name">
                  <span class="name">{{ getShowName(item) }}</span>
                  <img :src="getPlatformIcon(item.conversation_type)" class="platform-icon" />
                  <i
                    v-if="item.user_name"
                    class="iconfont icon-fuzhi copy"
                    @click="handleCopy($event, item.user_name)"
                  />
                </div>
                <div class="pending-user-time">{{ item.time }}</div>
              </div>
              <div class="pending-user-message">{{ item.message }}</div>
            </div>
            <MinusCircleFilled class="remove-icon" @click="handleRemove($event, index)" />
          </div>
        </div>
      </Form.Item>
    </Form>
    <div class="footer">
      {{ $t('assistant.footer', { platform: 'LINE' }) }}
    </div>
  </Card>
</template>

<script setup lang="ts">
import { Card, Form, Button, Cascader } from 'ant-design-vue';
import { MinusCircleFilled } from '@ant-design/icons-vue';
import useAssistant from './use-assistant';
import { getPlatformIcon } from '@/utils';

const {
  serviceInfo,
  pendingUsers,
  getShowName,
  handleStart,
  handleStop,
  handleClearPendingUsers,
  handleCopy,
  handleRemove,
  handleSwitchChat,
  handleChangeConversation,
} = useAssistant();
</script>

<style scoped lang="less">
.service-status {
  height: 36px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f6f8fa;
  border-radius: 6px;
  .status {
    position: relative;
    padding-left: 14px;
    .service-status-icon {
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -3px;
      display: inline-block;
      width: 6px;
      height: 6px;
      background: @success-color;
      border-radius: 50%;
      margin-right: 4px;
      &.is-stop {
        background: @error-color;
      }
      &.is-enabled {
        background: @success-color;
      }
    }
  }
  .action {
    padding: 0 10px;
    border-radius: 30px;
    border: none;
    cursor: pointer;
    &.is-stop {
      color: @success-color;
      background: #f0fff0;
    }
    &.is-enabled {
      color: @error-color;
      background: #fff2f0;
    }
  }
}
.no-data {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: rgba(37, 48, 68, 0.32);
  line-height: 20px;
  img {
    width: 117px;
    height: auto;
    margin-bottom: 15px;
  }
}
.pending-users {
  margin-top: -8px;
  .pending-user-item {
    padding: 15px 6px;
    border-bottom: 1px solid #eef2f9;
    display: flex;
    align-items: center;
    position: relative;
    font-family:
      PingFang SC,
      PingFang SC;
    font-weight: 400;
    font-size: 13px;
    color: #253044;
    line-height: 22px;
    border-radius: 6px;
    &:hover {
      background: #f3f4f6;
      &::after {
        content: '';
        display: block;
        position: absolute;
        right: 0;
        top: 0;
        width: 150px;
        height: 100%;
        background: linear-gradient(90deg, rgba(243, 244, 246, 0.2) 0%, rgba(243, 244, 246, 0.6) 50%, #f3f4f6 100%);
      }
      .iconfont.copy {
        visibility: visible;
      }
      .remove-icon {
        visibility: visible;
      }
    }
    &-avatar {
      margin-right: 12px;
      width: 36px;
      height: 36px;
      border-radius: 36px;
    }
    &-info {
      flex: auto;
      overflow: hidden;
    }
    &-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .pending-user-name {
        max-width: 46vw;
        display: flex;
        align-items: center;
      }
      .name {
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .platform-icon {
        width: 12px;
        margin: 0 4px;
      }
      .iconfont.copy {
        font-size: 14px;
        cursor: pointer;
        visibility: hidden;
        color: rgba(37, 48, 68, 0.52);
      }
    }
    .pending-user-message {
      font-weight: 400;
      font-size: 11px;
      color: rgba(37, 48, 68, 0.52);
      line-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .pending-user-time {
      position: absolute;
      right: 0;
      font-size: 11px;
      color: rgba(37, 48, 68, 0.32);
    }
    .remove-icon {
      position: absolute;
      right: 16px;
      top: 50%;
      margin-top: -7px;
      font-size: 14px;
      z-index: 10;
      cursor: pointer;
      color: @primary-color;
      visibility: hidden;
    }
  }
}
:deep(.ant-form) {
  .ant-form-item {
    &:last-child {
      margin-bottom: 0;
    }
  }
}
.footer {
  margin-top: 16px;
  font-family:
    PingFang SC,
    PingFang SC;
  font-weight: 400;
  font-size: 12px;
  color: rgba(37, 48, 68, 0.32);
  line-height: 16px;
}
@keyframes ripple {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

.ripple-effect {
  position: absolute;
  left: -1px;
  top: 50%;
  width: 8px;
  height: 8px;
  margin-top: -4px;
  background: @success-color;
  border-radius: 50%;
  visibility: hidden;
  &.show {
    visibility: visible;
    animation: ripple 2s infinite;
  }
}
:deep(.ant-select-selection-placeholder) {
  font-size: 12px;
}
</style>
