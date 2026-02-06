
import { Store, KPI } from './types';
import { supabase } from './supabaseClient';

export const db = {
  // Retorna todos os dados salvos do Supabase
  getStores: async (): Promise<Store[]> => {
    const { data: stores, error } = await supabase
      .from('stores')
      .select('*, kpis(*)');

    if (error) {
      console.error("DB: Erro ao buscar lojas:", error);
      return [];
    }

    // Mapear os dados para o formato esperado pelo app (snake_case para camelCase e JSONb)
    return stores.map(s => ({
      id: s.id,
      code: s.code,
      razaoSocial: s.razao_social,
      fantasia: s.fantasia,
      manager: s.manager,
      lastUpdate: s.last_update,
      customRewards: s.custom_rewards,
      tierColors: s.tier_colors,
      kpis: (s.kpis || []).map((k: any) => ({
        id: k.id,
        name: k.name,
        description: k.description,
        category: k.category,
        target: k.target,
        actual: k.actual,
        unit: k.unit,
        weight: k.weight
      }))
    })) as Store[];
  },

  // Salva ou atualiza uma loja no Supabase
  saveStore: async (store: Store) => {
    const { data, error } = await supabase
      .from('stores')
      .upsert({
        id: store.id,
        code: store.code,
        razao_social: store.razaoSocial,
        fantasia: store.fantasia,
        manager: store.manager,
        last_update: store.lastUpdate,
        custom_rewards: store.customRewards,
        tier_colors: store.tierColors
      })
      .select()
      .single();

    if (error) {
      console.error("DB: Erro ao salvar loja:", error);
      return null;
    }

    // Salvar/Atualizar KPIs relacionados
    if (store.kpis && store.kpis.length > 0) {
      const kpisToUpsert = store.kpis.map(k => ({
        id: k.id,
        store_id: data.id,
        name: k.name,
        description: k.description,
        category: k.category,
        target: k.target,
        actual: k.actual,
        unit: k.unit,
        weight: k.weight
      }));

      const { error: kpiError } = await supabase
        .from('kpis')
        .upsert(kpisToUpsert);

      if (kpiError) console.error("DB: Erro ao salvar KPIs:", kpiError);
    }

    return data;
  },

  // Deleta uma loja
  deleteStore: async (id: string) => {
    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', id);

    if (error) console.error("DB: Erro ao deletar loja:", error);
    return !error;
  }
};
