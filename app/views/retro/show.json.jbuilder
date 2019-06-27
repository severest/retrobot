json.(@retro, :id, :key, :status, :creator, :max_votes, :include_temperature_check)
json.time_limit @retro.time_limit_minutes

json.delta_groups do
  json.array! @retro.delta_groups, partial: 'retro/delta_group', as: :delta_group
end
json.pluses do
  json.array! @retro.pluses, partial: 'retro/plus', as: :plus
end
json.prev_deltas do
  json.array! @prev_retro_delta_groups_without_notes, partial: 'retro/delta_group', as: :delta_group
end
json.temperature_checks do
  json.array! @retro.temperature_checks, partial: 'retro/temperature_check', as: :temperature_check
end
