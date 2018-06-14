require 'test_helper'

class RetroControllerTest < ActionDispatch::IntegrationTest
  test "create a retro" do
    assert_difference('Retro.count', 1) do
      post '/api/retro/new', params: {}
      assert_response :success
    end
  end

  test "create a retro with a new team" do
    assert_difference('Team.count', 1) do
      post '/api/retro/new', params: { retro: { team: 'New team' } }
      assert_response :success
    end
  end

  test "create a retro with a new team with password" do
    assert_difference('Team.count', 1) do
      post '/api/retro/new', params: { retro: { team: 'New team', password: 'hi' } }
      assert_response :success
      t = Team.find_by_name('new team')
      assert t.password == 'hi'
    end
  end

  test "create a retro with an existing team" do
    assert_difference('Retro.count', 1) do
      t = teams(:one)
      post '/api/retro/new', params: { retro: { team: t.name } }
      assert_response :success
    end
  end

  test "should not create a retro with password protected team and no password" do
    assert_no_difference('Retro.count') do
      t = teams(:password_protected)
      post '/api/retro/new', params: { retro: { team: t.name } }
      assert_response :bad_request
    end
  end

  test "should create a retro with password protected team" do
    assert_difference('Retro.count', 1) do
      t = teams(:password_protected)
      post '/api/retro/new', params: { retro: { team: t.name, password: 'testpassword' } }
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
    assert_equal 5, json_response['deltas'].count
    assert_equal 5, json_response['pluses'].count
  end

  test "should show retro with previous deltas" do
    get "/api/retro/#{retros(:empty).key}"
    assert_response :success
    json_response = JSON.parse(@response.body)
    assert_equal 2, json_response['prev_deltas'].count
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
end
