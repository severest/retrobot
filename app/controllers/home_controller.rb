class HomeController < ApplicationController
  def index
    @retro = Retro.new
  end
end
