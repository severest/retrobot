class Team < ApplicationRecord
  include BCrypt
  before_save :downcase_name
  has_many :retros
  validates :name, presence: true

  def password
    @password ||= Password.new(password_hash)
  end

  def password=(new_password)
    @password = Password.create(new_password)
    self.password_hash = @password
  end

  def self.find_with_password(team_data)
    raise TeamNotFound if team_data[:name].nil?
    team = Team.find_by_name(team_data[:name].downcase.strip)
    if team.nil?
      raise TeamNotFound
    else
      if team.password_hash != nil && team.password != team_data[:password]
        raise RetroNotAuthorized
      end
    end
    return team
  end

  def self.find_or_create(team_data)
    begin
      team = Team.find_with_password(team_data)
    rescue TeamNotFound
      team = Team.create(name: team_data[:name], password: team_data[:password])
    end
    return team
  end

  private

  def downcase_name
    self.name = self.name.downcase.strip
  end
end
