class RetroController < ApplicationController
  def show
    @retro = Retro.where(key: params[:key]).first()
  end

  def new
    key = SecureRandom.hex(3)
    @retro = Retro.create(key: key)
    render json: { key: @retro.key }
  end
end
