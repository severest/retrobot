json.(@team, :id, :name)

json.totalRetros @total_retros
json.retros do
  json.array! @retros do |retro|
    json.key retro.key
    json.createdAt retro.created_at
    json.delta_groups retro.delta_groups do |delta_group|
      json.(delta_group, :id, :notes)
      json.array! delta_group.deltas, partial: 'retro/delta', as: :delta
      json.votes do
        json.array! delta_group.delta_group_votes.pluck(:user)
      end
    end
  end
end
