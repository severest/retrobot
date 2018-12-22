class Retro < ApplicationRecord
  has_many :pluses, class_name: 'Plus'
  has_many :deltas, class_name: 'Delta'
  has_many :delta_groups
  has_many :temperature_checks
  belongs_to :team, optional: true
  enum status: [ :in_progress, :voting, :locked ]

  validates :max_votes, :time_limit_minutes, presence: true
  validates :key, format: { with: /\A[a-zA-Z0-9]{6}\z/,
    message: "6 digit alphanumeric" }

  def self.prune_old_retros
    Retro.left_joins(:pluses).left_joins(:deltas).group(:id).where('retros.created_at < ?', 7.days.ago)
         .where('pluses.id is null AND deltas.id is null').destroy_all
  end

  def delta_group_array
    self.delta_groups.map {
      |group| {
        'id' => group.id,
        'deltas' => group.deltas.pluck(:id)
      }
    }
  end
end
