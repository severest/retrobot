json.(@retro, :id, :key, :status, :creator, :max_votes)

json.deltas do
  json.array! @retro.deltas, partial: 'retro/delta', as: :delta
end
json.pluses do
  json.array! @retro.pluses, partial: 'retro/plus', as: :plus
end
json.prev_deltas do
  json.array! @prev_retro_deltas, partial: 'retro/delta', as: :delta
end
