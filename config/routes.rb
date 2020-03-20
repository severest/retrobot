Rails.application.routes.draw do
  scope 'api' do
    get 'retro/:key', to: 'retro#show', constraints: { key: /[A-Za-z0-9]{6}/ }
    post 'retro/new', to: 'retro#new'
    post 'team/summary', to: 'team#summary'
    post 'team/temperaturechecks', to: 'team#temperature_checks'
  end

  get 'amialive', to: 'healthcheck#amialive'

  root 'home#index'
  get '*path', to: 'home#index', constraints: lambda { |req|
    req.path.exclude? 'cable'
  }
end
