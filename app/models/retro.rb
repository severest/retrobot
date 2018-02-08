class Retro < ApplicationRecord
  has_many :pluses, class_name: 'Plus'
  has_many :deltas, class_name: 'Delta'
  belongs_to :team, optional: true

  validates :key, format: { with: /\A[a-zA-Z0-9]{6}\z/,
    message: "6 digit alphanumeric" }

  def self.prune_old_retros
    Retro.left_joins(:pluses).left_joins(:deltas).group(:id).where('retros.created_at < ?', 7.days.ago)
         .where('pluses.id is null AND deltas.id is null').destroy_all
  end
end
