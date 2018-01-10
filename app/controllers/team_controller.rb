class TeamController < ApplicationController
  def summary
    if session[:team_id]
      @team = Team.find(session[:team_id])
      if @team.name == team_params[:name]
        return render_summary
      end
      session[:team_id] = nil
    end

    begin
      @team = Team.find_with_password(team_params)
    rescue TeamNotFound
      return render json: { error: 'Team not found' }, :status => :not_found
    rescue RetroNotAuthorized
      return render json: { error: 'No access to that team' }, :status => :unauthorized
    end
    session[:team_id] = @team.id
    render_summary
  end

  private

  def team_params
    params.fetch(:team, {}).permit(:name, :password)
  end

  def render_summary
    render 'team/summary.json.jbuilder'
  end
end
