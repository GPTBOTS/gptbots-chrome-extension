<template>
  <ConfigProvider>
    <main class="main">
      <Tabs v-model:activeKey="activeKey" :bordered="false">
        <template #rightExtra>
          <i class="iconfont icon-shuaxin" @click="handleRefresh"></i>
        </template>
        <Tabs.TabPane key="1" :tab="$t('global.assistant')">
          <Assistant />
        </Tabs.TabPane>
        <Tabs.TabPane key="2" :tab="$t('global.reply_suggestions')">
          <ReplySuggestions />
        </Tabs.TabPane>
        <Tabs.TabPane key="3" :tab="$t('global.settings')">
          <Settings :configSettings="globalState.config" />
        </Tabs.TabPane>
      </Tabs>
    </main>
  </ConfigProvider>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ConfigProvider, Tabs } from 'ant-design-vue';
import { ReplySuggestions, Assistant, Settings } from './components';
import { globalState } from './hooks/use-global-data';

const activeKey = ref('');

onMounted(() => {
  setTimeout(() => {
    activeKey.value = globalState.config.api_key ? '1' : '3';
  }, 100);
});

function handleRefresh() {
  window.location.reload();
}
</script>

<style lang="less">
.main {
  height: 100%;

  .ant-tabs {
    height: 100%;
    margin-bottom: 20px;

    .ant-tabs-nav {
      margin-bottom: 20px;

      &-wrap {
        background: #f7f9fa;
        border-radius: 100px;
      }

      &::before {
        display: none;
      }

      .icon-shuaxin {
        font-size: 18px;
        margin-left: 10px;
        margin-right: 0;
        color: #485162;
        cursor: pointer;
      }
    }

    .ant-tabs-nav-list {
      width: 100%;
      justify-content: space-between;
      padding: 4px;

      .ant-tabs-tab {
        height: 32px;
        padding: 12px;
        flex: 1;
        justify-content: center;

        &-active {
          background: #ffffff;
          box-shadow: 0px 0px 4px 0px rgba(61, 75, 83, 0.21);
          border-radius: 100px;
        }

        &+.ant-tabs-tab {
          margin-left: 0;
        }
      }
    }

    .ant-tabs-ink-bar {
      display: none;
    }

    .ant-tabs-content {
      height: 100%;
    }
  }

  .ant-card {
    box-shadow: none;

    .ant-card-body {
      padding: 0;
    }
  }

  .ant-form-item-label {
    width: 100%;
    font-family:
      PingFang SC,
      PingFang SC;
    font-weight: 600;
    font-size: 14px;
    color: #253044;
    line-height: 22px;

    label {
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }

  .ant-form-item-control-input {
    min-height: auto;
  }

  .label-right {
    cursor: pointer;
    color: @primary-color;
    font-size: 12px;
    font-weight: 400;
  }

  .iconfont {
    font-size: 12px;
    margin-right: 4px;
  }
}
</style>
