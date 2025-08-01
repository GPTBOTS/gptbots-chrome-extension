<template>
  <Card :bordered="false" class="settings-card">
    <Form :colon="false" :labelCol="{ span: 24 }" :wrapperCol="{ span: 24 }">
      <Form.Item>
        <template #label>
          <span>{{ $t('settings.integrate') }}</span>
          <a
            v-if="!props.configSettings.api_key"
            href="https://www.gptbots.ai/docs/api-reference/overview"
            target="_blank"
            class="label-right"
            >{{ $t('settings.get_key') }}
          </a>
          <span v-else @click="handleClear" class="label-right">
            {{ $t('settings.clear') }}
          </span>
        </template>
        <div class="config-wrapper">
          <div class="config-label">GPTBots API KEY</div>
          <div class="config-content">
            <Input
              v-if="integrateInfo.isEditing"
              :placeholder="$t('global.input')"
              v-model:value="integrateInfo.api_key"
              :disabled="!integrateInfo.isEditing"
            />
            <Input v-else type="password" disabled :placeholder="$t('global.input')" :value="configSettings.api_key" />
          </div>
          <div class="config-label">
            <span>
              <span>response_mode</span>
              <Tooltip :title="$t('settings.response_mode_tip')">
                <i class="iconfont icon-tips" />
              </Tooltip>
            </span>
            <span v-if="!integrateInfo.isEditing" class="config-value">{{ integrateInfo.response_mode }}</span>
          </div>
          <div v-if="integrateInfo.isEditing" class="config-content">
            <Radio.Group v-model:value="integrateInfo.response_mode">
              <Radio value="blocking">blocking</Radio>
              <Radio value="streaming">streaming</Radio>
            </Radio.Group>
          </div>
          <div class="integrate-btn-wrapper">
            <section>
              <Button
                class="primary-btn"
                type="primary"
                size="small"
                :loading="integrateInfo.loading"
                @click="integrateInfo.isEditing ? handleIntegrate() : handleEdit()"
                >{{ integrateInfo.isEditing ? $t('global.submit') : $t('global.edit') }}
              </Button>
              <Button v-if="integrateInfo.isEditing" size="small" @click="handleCancel">
                {{ $t('global.cancel') }}
              </Button>
            </section>
            <span
              v-if="!integrateInfo.isEditing"
              class="tips static"
              :class="{ success: configSettings.api_key, error: !configSettings.api_key }"
            >
              {{ configSettings.api_key ? $t('global.integrated') : $t('global.unintegrated') }}
            </span>
          </div>
        </div>
      </Form.Item>

      <Form.Item>
        <template #label>
          <span>{{ $t('settings.web_hooks') }}</span>
          <a
            class="label-right"
            href="https://www.gptbots.ai/docs/tutorial/bot/human-handoff#webhook-authentication"
            target="_blank"
            >{{ $t('settings.how_to_configure') }}
          </a>
        </template>
        <Input disabled :placeholder="$t('global.webhook_placeholder')" :value="integrateInfo.web_hooks">
          <template #suffix>
            <i class="iconfont icon-fuzhi" @click="handleCopyWebhooks" />
          </template>
        </Input>
      </Form.Item>

      <Form.Item :wrapper-col="{ span: 24 }">
        <template #label>
          <span>{{ $t('settings.language_selection') }}</span>
        </template>
        <Select
          style="width: 100%"
          :value="locale"
          :options="localeOptions"
          @change="handleSetLocale($event as Locale)"
        />
      </Form.Item>

      <Form.Item :label="$t('settings.support_platforms')">
        <span v-for="item in supportPlatforms.filter((i) => i.support)" :key="item.host" class="support-item">
          <img :src="item.icon" width="20" />
          {{ item.label }}
        </span>
      </Form.Item>
    </Form>
  </Card>
</template>

<script setup lang="ts">
import { Card, Input, Form, Button, Select, Radio, Tooltip } from 'ant-design-vue';
import { ConfigSettings, Locale } from '@/types/default';
import { supportPlatforms, localeOptions } from '@/config.options';
import { useSettings } from './use-settings';

const props = defineProps<{
  configSettings: ConfigSettings;
}>();

const {
  locale,
  integrateInfo,
  handleIntegrate,
  handleEdit,
  handleCancel,
  handleCopyWebhooks,
  handleSetLocale,
  handleClear,
} = useSettings();
</script>

<style scoped lang="less">
.settings-card {
  .config-wrapper {
    padding: 12px;
    background: #f6f8fa;
    border-radius: 6px;

    .config-label {
      margin-bottom: 8px;

      .icon-tips {
        margin-left: 4px;
        margin-right: 10px;
        font-size: 14px;
        color: rgba(37, 48, 68, 0.52);
      }
    }

    .config-value {
      color: rgba(37, 48, 68, 0.52);
    }

    .config-content {
      &+.config-label {
        margin-top: 8px;
      }

      :deep(.ant-radio-wrapper) {
        margin-right: 0;
        color: rgba(37, 48, 68, 0.84);

        &+.ant-radio-wrapper {
          margin-left: 36px;
        }
      }

    }
  }

  .integrate-btn-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;

    .ant-btn {
      margin-right: 8px;
    }

    .tips {
      position: relative;
      font-size: 12px;
      color: rgba(37, 48, 68, 0.84);

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -2px;
        margin-left: -8px;
        display: inline-block;
        width: 4px;
        height: 4px;
        border-radius: 50%;
      }

      &.success {
        color: @success-color;

        &::before {
          background: @success-color;
        }
      }

      &.error {
        color: @error-color;

        &::before {
          background: @error-color;
        }
      }

      &.static {
        color: rgba(37, 48, 68, 0.84);
      }
    }
  }

  .iconfont.icon-fuzhi {
    cursor: pointer;
  }
}
</style>
