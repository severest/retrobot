class RetroController < ApplicationController
  def show
    @retro = Retro.find_by_key!(params[:key])
  end

  def new
    key = SecureRandom.hex(3)
    @retro = Retro.create(key: key)
    render json: { key: @retro.key }
  end
end
