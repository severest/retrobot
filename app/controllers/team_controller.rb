class TeamController < ApplicationController
  def summary
    @team = get_team
    if !@team.nil?
      page = params[:page].try(&:to_i) || 1
      limit = 10
      offset = (page - 1) * limit
      @retros = @team.retros.includes({deltas: :delta_votes}, :temperature_checks, :delta_groups)
        .where('status' => :locked)
        .order('created_at desc')
        .limit(limit)
        .offset(offset)
      @total_retros = @team.retros.where('status' => :locked).count
      render 'team/summary.json.jbuilder'
    end
  end

  def temperature_checks
    @team = get_team
    if !@team.nil?
      begin
        fromDate = Date.strptime(params[:from], '%Y-%m-%d')
      rescue
        fromDate = Date.today - 6.months
      end

      @temperature_checks = TemperatureCheck.joins(:retro)
        .where('retros.created_at > ?', fromDate)
        .where('retros.team_id = ?', @team.id)
        .where('retros.status' => :locked)
      render 'team/temperature_checks.json.jbuilder'
    end
  end

  private

  def get_team
    if session[:team_id]
      team = Team.find(session[:team_id])
      if team.name == team_params[:name]
        return team
      end
      session[:team_id] = nil
    end

    begin
      team = Team.find_with_password(team_params)
      session[:team_id] = team.id
      return team
    rescue TeamNotFound
      render json: { error: 'Team not found' }, :status => :not_found
    rescue RetroNotAuthorized
      render json: { error: 'No access to that team' }, :status => :unauthorized
    end
    return nil
  end

  def team_params
    params.fetch(:team, {}).permit(:name, :password)
  end
end
