class RetroController < ApplicationController
  def show
    @retro = Retro.find_by_key!(params[:key])
    render 'retro/show.json.jbuilder'
  end

  def new
    team = nil
    if retro_params[:team] != nil && retro_params[:team].strip != ''
      begin
        team = Team.find_or_create(name: retro_params[:team], password: retro_params[:password])
      rescue RetroNotAuthorized
        return render json: { error: 'No access to that team' }, status: :bad_request
      end
    end
    key = SecureRandom.hex(3)
    @retro = Retro.create(key: key, team: team)
    return render json: { key: @retro.key }
  end

  private

  def retro_params
    params.fetch(:retro, {}).permit(:team, :password)
  end
end
