Rails.application.routes.draw do
  scope 'api' do
    get 'retro/:key', to: 'retro#show', constraints: { key: /[A-Za-z0-9]{6}/ }
    post 'retro/new', to: 'retro#new'
    post 'team/summary', to: 'team#summary'
  end

  if Rails.env.test?
    root 'home#index'
    get 'retro/*key', to: 'home#index'
    get 'summary/*team', to: 'home#index'
  end
end
