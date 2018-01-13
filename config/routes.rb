Rails.application.routes.draw do
  if Rails.env.test?
    root 'home#index'
  end
  
  scope 'api' do
    get 'retro/:key', to: 'retro#show', constraints: { key: /[A-Za-z0-9]{6}/ }
    post 'retro/new', to: 'retro#new'
    post 'team/summary', to: 'team#summary'
  end
end
