json.(@team, :id, :name)

json.totalRetros @total_retros
json.retros do
  json.array! @retros do |retro|
    json.key retro.key
    json.createdAt retro.created_at
    json.deltas do
      json.array! retro.deltas, partial: 'retro/delta', as: :delta
    end
    json.deltaGroups retro.delta_group_array
  end
end
