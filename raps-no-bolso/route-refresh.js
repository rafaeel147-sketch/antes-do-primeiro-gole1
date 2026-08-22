// Reprocessa a rota depois que todos os módulos adicionais foram carregados.
// Isso permite abrir diretamente URLs como ?p=ad-recaida ou ?p=direitos-saude-mental.
render(currentRoute(), false);
