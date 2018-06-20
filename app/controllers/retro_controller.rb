class RetroController < ApplicationController
  def show
    @retro = Retro.find_by_key!(params[:key])
    @prev_retro_deltas = []
    prev_retro = Retro.where(team: @retro.team)
                      .where.not(team: nil)
                      .where(status: :locked)
                      .where.not(id: @retro.id)
                      .order('created_at desc').first()
    if !prev_retro.nil?
      @prev_retro_deltas = prev_retro.deltas
    end
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
    @retro = Retro.create(key: key, team: team, creator: retro_params[:creator],
                          max_votes: retro_params[:max_votes], status: 'in_progress',
                          time_limit_minutes: retro_params[:time_limit])
    return render json: { key: @retro.key }
  end

  private

  def retro_params
    params.fetch(:retro, {}).permit(:team, :password, :creator, :time_limit, :max_votes)
  end
end
