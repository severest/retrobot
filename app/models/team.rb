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

  def self.find_or_create(team_data)
    team = Team.find_by_name(team_data[:name].downcase.strip)
    if team.nil?
      team = Team.create(name: team_data[:name], password: team_data[:password])
    else
      if team.password_hash != nil && team.password != team_data[:password]
        raise RetroNotAuthorized
      end
    end
    return team
  end

  private

  def downcase_name
    self.name = self.name.downcase.strip
  end
end
