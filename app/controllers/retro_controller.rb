class RetroController < ApplicationController
  def show
    @retro = Retro.find_by_key!(params[:key])
    @prev_retro_deltas_without_notes = []
    prev_retro = Retro.includes(:deltas)
                      .where(team: @retro.team)
                      .where.not(team: nil)
                      .where(status: :locked)
                      .where.not(id: @retro.id)
                      .order('created_at desc').first()
    if !prev_retro.nil?
      deltas = prev_retro.deltas.select{ |delta| delta.notes.nil? || delta.notes == "" }
      delta_groups = DeltaGroup.includes(:deltas).where(retro: prev_retro)
      delta_groups.each do |group|
        if group.deltas.any? { |delta| !delta.notes.nil? && delta.notes != "" }
          deltas = deltas.select{ |delta| !group.deltas.include?(delta) }
        end
      end
      @prev_retro_deltas_without_notes = deltas
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
    @retro = Retro.new(key: key, team: team, creator: retro_params[:creator],
                          max_votes: retro_params[:max_votes], status: 'in_progress',
                          time_limit_minutes: retro_params[:time_limit],
                          include_temperature_check: retro_params[:include_temperature_check])
    if @retro.save
      return render json: { key: @retro.key }
    else
      return render json: { 'error' => 'Unable to create new retro' }, status: :bad_request
    end
  end

  private

  def retro_params
    params.fetch(:retro, {}).permit(:team, :password, :creator, :time_limit, :max_votes, :include_temperature_check)
  end
end
