Rails.application.routes.draw do
  root 'home#index'

  get 'retro/:key', to: 'retro#show', constraints: { key: /[A-Za-z0-9]{6}/ }
  post 'retro/new', to: 'retro#new'
end
