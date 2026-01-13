import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authAPI = {
  register: async (data) => {
    const response = await axios.post(`${API}/auth/register`, data);
    return response.data;
  },
  login: async (data) => {
    const response = await axios.post(`${API}/auth/login`, data);
    return response.data;
  },
  updateEmail: async (newEmail, password) => {
    const response = await axios.post(
      `${API}/auth/update-email`,
      { new_email: newEmail, password },
      { headers: getAuthHeader() }
    );
    return response.data;
  },
};

export const deitiesAPI = {
  getAll: async () => {
    const response = await axios.get(`${API}/deities`);
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`${API}/deities/${id}`);
    return response.data;
  },
};

export const figuresAPI = {
  getAll: async () => {
    const response = await axios.get(`${API}/historical-figures`);
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`${API}/historical-figures/${id}`);
    return response.data;
  },
};

export const sitesAPI = {
  getAll: async () => {
    const response = await axios.get(`${API}/sacred-sites`);
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`${API}/sacred-sites/${id}`);
    return response.data;
  },
};

export const ritualsAPI = {
  getAll: async (category) => {
    const url = category ? `${API}/rituals?category=${category}` : `${API}/rituals`;
    const response = await axios.get(url);
    return response.data;
  },
  getById: async (id) => {
    const response = await axios.get(`${API}/rituals/${id}`);
    return response.data;
  },
};

export const timelineAPI = {
  // Legacy simple timeline
  getAll: async () => {
    const response = await axios.get(`${API}/timeline`);
    return response.data;
  },
  
  // Enhanced V2 Timeline API
  getEventsV2: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.categories) params.append('categories', filters.categories.join(','));
    if (filters.primaryCategories) params.append('primary_categories', filters.primaryCategories.join(','));
    if (filters.traditions) params.append('traditions', filters.traditions.join(','));
    if (filters.guides) params.append('guides', filters.guides.join(','));
    if (filters.startYear) params.append('start_year', filters.startYear);
    if (filters.endYear) params.append('end_year', filters.endYear);
    if (filters.importance) params.append('importance', filters.importance.join(','));
    if (filters.figures) params.append('figures', filters.figures.join(','));
    if (filters.search) params.append('search', filters.search);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.skip) params.append('skip', filters.skip);
    
    const response = await axios.get(`${API}/timeline/v2/events?${params.toString()}`);
    return response.data;
  },
  
  getEventById: async (eventId) => {
    const response = await axios.get(`${API}/timeline/v2/events/${eventId}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await axios.get(`${API}/timeline/v2/stats`);
    return response.data;
  },
  
  getGraph: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.categories) params.append('categories', filters.categories.join(','));
    if (filters.traditions) params.append('traditions', filters.traditions.join(','));
    if (filters.guides) params.append('guides', filters.guides.join(','));
    
    const response = await axios.get(`${API}/timeline/v2/graph?${params.toString()}`);
    return response.data;
  },
  
  getTaxonomy: async () => {
    const response = await axios.get(`${API}/timeline/v2/taxonomy`);
    return response.data;
  },
};

export const aiAPI = {
  chat: async (message, sessionId, archetype = null) => {
    const response = await axios.post(`${API}/ai/chat`, {
      message,
      session_id: sessionId,
      archetype: archetype,
    });
    return response.data;
  },
  generateSpell: async (intention, archetype = null, generateImage = true) => {
    const response = await axios.post(`${API}/ai/generate-spell`, {
      intention,
      archetype,
      generate_image: generateImage,
    });
    return response.data;
  },
  generateImage: async (prompt) => {
    const response = await axios.post(`${API}/ai/generate-image`, { prompt });
    return response.data;
  },
};

// Dual-Model Research API (DeepSeek + OpenAI)
export const researchAPI = {
  // DeepSeek-powered research engine
  research: async (query, context = null) => {
    const response = await axios.post(`${API}/research`, {
      query,
      context,
    });
    return response.data;
  },
  // OpenAI-powered persona spellbook voice
  spellbook: async (userRequest, persona, tone = 'gentle') => {
    const response = await axios.post(`${API}/spellbook`, {
      user_request: userRequest,
      persona,
      tone,
    });
    return response.data;
  },
  // Combined: Both engines together
  combined: async (userRequest, persona = 'shigg', tone = 'gentle', context = null) => {
    const response = await axios.post(`${API}/combined`, {
      user_request: userRequest,
      persona,
      tone,
      context,
    });
    return response.data;
  },
};

export const archetypesAPI = {
  getAll: async () => {
    const response = await axios.get(`${API}/archetypes`);
    return response.data;
  },
};

export const favoritesAPI = {
  getAll: async () => {
    const response = await axios.get(`${API}/favorites`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
  add: async (itemType, itemId) => {
    const response = await axios.post(
      `${API}/favorites`,
      { item_type: itemType, item_id: itemId },
      { headers: getAuthHeader() }
    );
    return response.data;
  },
  remove: async (itemType, itemId) => {
    const response = await axios.delete(`${API}/favorites`, {
      data: { item_type: itemType, item_id: itemId },
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export const grimoireAPI = {
  saveSpell: async (spellData, archetypeId, archetypeName, archetypeTitle, imageBase64, assetPlan = null) => {
    const response = await axios.post(
      `${API}/grimoire/save`,
      {
        spell_data: spellData,
        archetype_id: archetypeId,
        archetype_name: archetypeName,
        archetype_title: archetypeTitle,
        image_base64: imageBase64,
        asset_plan: assetPlan,  // Include tarot, sigil, dividers, micro_icons
      },
      { headers: getAuthHeader() }
    );
    return response.data;
  },
  getAllSpells: async () => {
    const response = await axios.get(`${API}/grimoire/spells`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
  deleteSpell: async (spellId) => {
    const response = await axios.delete(`${API}/grimoire/spells/${spellId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};

export const subscriptionAPI = {
  getStatus: async () => {
    const response = await axios.get(`${API}/subscription/status`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
};