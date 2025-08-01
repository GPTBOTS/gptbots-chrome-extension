import * as settings from './modules/settings';
import * as replySuggestions from './modules/reply-suggestions';
import * as assistant from './modules/assistant';

const global = {
  'global.assistant': 'Humano',
  'global.reply_suggestions': 'Sugerencia',
  'global.settings': 'Ajustes',
  'global.input': 'Por favor ingrese',
  'global.cancel': 'Cancelar',
  'global.submit': 'Enviar',
  'global.edit': 'Editar',
  'global.integrated': 'Integrado',
  'global.unintegrated': 'No integrado',
  'global.webhook_placeholder': 'Necesita obtener la dirección después de la integración',
  'global.no_data': 'No hay datos',
  'global.plugin_disconnected': 'La conexión de la página se ha desconectado, por favor actualice la página',
};

export default {
  ...global,
  ...settings.es_ES,
  ...replySuggestions.es_ES,
  ...assistant.es_ES,
};
