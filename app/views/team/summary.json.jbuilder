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
    json.temperature_checks do
      json.array! retro.temperature_checks, partial: 'retro/temperature_check', as: :temperature_check
    end
  end
end
