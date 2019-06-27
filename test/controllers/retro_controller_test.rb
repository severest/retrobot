require 'test_helper'

class RetroControllerTest < ActionDispatch::IntegrationTest
  test "create a retro" do
    assert_difference('Retro.count', 1) do
      post '/api/retro/new', params: { retro: { max_votes: '5', time_limit: '10' } }
      assert_response :success
    end
  end

  test "create a retro with params" do
    assert_difference('Retro.count', 1) do
      post '/api/retro/new', params: { retro: { max_votes: '5', time_limit: '10' } }
      assert_response :success
      json_response = JSON.parse(@response.body)
      retro = Retro.find_by_key(json_response['key'])
      assert_equal retro.max_votes, 5
      assert_equal retro.time_limit_minutes, 10
      assert !retro.include_temperature_check
    end
  end

  test "create a retro with include_temperature_check" do
    assert_difference('Retro.count', 1) do
      post '/api/retro/new', params: { retro: { max_votes: '5', time_limit: '10', include_temperature_check: true } }
      assert_response :success
      json_response = JSON.parse(@response.body)
      retro = Retro.find_by_key(json_response['key'])
      assert retro.include_temperature_check
    end
  end

  test "create a retro with a new team" do
    assert_difference('Team.count', 1) do
      post '/api/retro/new', params: { retro: { max_votes: '5', time_limit: '10', team: 'New team' } }
      assert_response :success
    end
  end

  test "create a retro with a new team with password" do
    assert_difference('Team.count', 1) do
      post '/api/retro/new', params: { retro: { max_votes: '5', time_limit: '10', team: 'New team', password: 'hi' } }
      assert_response :success
      t = Team.find_by_name('new team')
      assert t.password == 'hi'
    end
  end

  test "create a retro with an existing team" do
    assert_difference('Retro.count', 1) do
      t = teams(:one)
      post '/api/retro/new', params: { retro: { max_votes: '5', time_limit: '10', team: t.name } }
      assert_response :success
    end
  end

  test "should not create a retro with password protected team and no password" do
    assert_no_difference('Retro.count') do
      t = teams(:password_protected)
      post '/api/retro/new', params: { retro: { max_votes: '5', time_limit: '10', team: t.name } }
      assert_response :bad_request
    end
  end

  test "should create a retro with password protected team" do
    assert_difference('Retro.count', 1) do
      t = teams(:password_protected)
      post '/api/retro/new', params: { retro: { max_votes: '5', time_limit: '10', team: t.name, password: 'testpassword' } }
      assert_response :success
    end
  end

  test "should show retro" do
    retro = create(:full_retro, key: 'abcdef')
    get "/api/retro/#{retro.key}"
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal retro.id, json_response['id']
    assert_equal 'abcdef', json_response['key']
    assert_equal 'in_progress', json_response['status']
    assert_equal 2, json_response['max_votes']
    assert_equal 5, json_response['time_limit']
    assert_equal 5, json_response['delta_groups'].count
    assert_equal 5, json_response['pluses'].count
    assert !json_response['include_temperature_check']
  end

  test "should show include temperature check" do
    retro = create(:full_retro, key: 'abcdef', include_temperature_check: true)
    get "/api/retro/#{retro.key}"
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert json_response['include_temperature_check']
  end

  test "should show retro delta_groups" do
    retro = create(:retro, key: 'abcdef')
    delta1 = create(:delta, retro: retro)
    delta2 = create(:delta, retro: retro)
    delta_group = create(:delta_group, retro: retro)
    delta_group.add_deltas([delta1.id, delta2.id])
    get "/api/retro/#{retro.key}"
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 1, json_response['delta_groups'].count
    assert_equal delta_group.id, json_response['delta_groups'][0]['id']
    assert_equal [delta1.id, delta2.id], json_response['delta_groups'][0]['deltas'].map { |d| d['id'] }
  end

  test "should show retro with previous deltas" do
    team = create(:team)
    create(:full_retro, team: team, status: :locked)
    retro = create(:retro, team: team, key: 'eeeee1')
    get "/api/retro/#{retro.key}"
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 5, json_response['prev_deltas'].count
  end

  test "should show retro with no previous deltas" do
    get "/api/retro/#{retros(:empty_and_old).key}"
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 0, json_response['prev_deltas'].count
  end

  test "should not have prev deltas on retro with no team" do
    old_retro = create(:full_retro, key: 'eeeee1', status: 'locked')
    retro = create(:retro, key: 'eeeee2')
    get "/api/retro/#{retro.key}"
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 0, json_response['prev_deltas'].count
  end

  test "should not have prev deltas that have notes" do
    team = create(:team)
    old_retro = create(:full_retro, key: 'eeeee1', status: 'locked', team: team)
    group = old_retro.delta_groups.first()
    group.notes = 'hi'
    group.save
    retro = create(:retro, key: 'eeeee2', team: team)
    get "/api/retro/#{retro.key}"
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 4, json_response['prev_deltas'].count
  end

  test "should not have prev deltas that belong to a group with notes" do
    team = create(:team)
    old_retro = create(:retro, key: 'eeeee1', status: 'locked', team: team)
    delta_group_w_notes = create(:delta_group, retro: old_retro, notes: 'hi')
    delta_group = create(:delta_group, retro: old_retro)
    delta1 = create(:delta, retro: old_retro)
    delta2 = create(:delta, retro: old_retro)
    delta_group_w_notes.add_deltas([delta1.id, delta2.id])
    delta3 = create(:delta, retro: old_retro)
    delta_group.add_deltas([delta3.id])
    retro = create(:retro, key: 'eeeee2', team: team)
    get "/api/retro/#{retro.key}"
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 1, json_response['prev_deltas'].count
  end

  test "should show retro temperature_checks" do
    retro = create(:full_retro, key: 'abcdef')
    create(:temperature_check, retro: retro, temperature: 4, notes: 'hi', user: '2')
    get "/api/retro/#{retro.key}"
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 1, json_response['temperature_checks'].count
    assert_equal 4, json_response['temperature_checks'][0]['temperature']
    assert_equal 'hi', json_response['temperature_checks'][0]['notes']
    assert_equal '2', json_response['temperature_checks'][0]['userId']
  end
end
