json.(@team, :id, :name)

json.retros do
  json.array! @team.retros.where('status' => :locked).order('created_at desc').limit(50) do |retro|
    json.key retro.key
    json.createdAt retro.created_at
    json.deltas do
      json.array! retro.deltas.order('votes desc').limit(4), partial: 'retro/delta', as: :delta
    end
  end
end
