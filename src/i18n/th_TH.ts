import * as settings from './modules/settings';
import * as replySuggestions from './modules/reply-suggestions';
import * as assistant from './modules/assistant';

const global = {
  'global.assistant': 'มนุษย์',
  'global.reply_suggestions': 'ข้อเสนอแนะ',
  'global.settings': 'ตั้งค่า',
  'global.input': 'กรุณาป้อนข้อมูล',
  'global.cancel': 'ยกเลิก',
  'global.submit': 'ส่ง',
  'global.edit': 'แก้ไข',
  'global.integrated': 'ผสานรวมแล้ว',
  'global.unintegrated': 'ยังไม่ได้ผสานรวม',
  'global.webhook_placeholder': 'จะได้รับที่อยู่หลังจากการผสานรวมสำเร็จ',
  'global.no_data': 'ไม่มีข้อมูล',
  'global.plugin_disconnected': 'การเชื่อมต่อหน้าถูกตัด กรุณารีเฟรชหน้า',
};

export default {
  ...global,
  ...settings.th_TH,
  ...replySuggestions.th_TH,
  ...assistant.th_TH,
};
