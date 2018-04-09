# name: hide_devs
# about: Hide pizza users, discourse plugin.
# version: 1.0.01
# authors: CitizenFX Collective & Tom Grobbe
# url: https://github.com/TomGrobbe/hide-devs-toggle

enabled_site_setting :hide_devs_enabled

require_dependency 'post_creator'
require_dependency 'topic_creator'

after_initialize do
	hide = Group.find_by name: 'hide'
	pizzaGroup = Group.find_by name: 'Pizza'

	module ::HideDevs; end

	module ::HideDevs::WebHookTopicViewSerializerExtensions
		def include_post_stream?
			true
		end
	end

	module ::HideDevs::PostCreatorExtensions
		def initialize(user, opts)
			hide = Group.find_by name: 'hide'
			pizzaGroup = Group.find_by name: 'Pizza'

			super
            
            if ((user.group_ids.include? hide.id) && !(opts[:raw].to_s.include? "<NoHideDevs>"))
                @user = pizzaGroup.users.sample
            else
                @user = user
            end
		end
	end

	class ::PostCreator
		prepend ::HideDevs::PostCreatorExtensions
	end

	class ::WebHookTopicViewSerializer
		prepend ::HideDevs::WebHookTopicViewSerializerExtensions
	end

	DiscourseEvent.on(:topic_created) do |topic, opts, user|
		topic.closed = true
		@post.topic.closed = true
	end
	
	DiscourseEvent.on(:post_created) do |post, opts, user|
		next unless ((user.group_ids.include? hide.id) && !(opts[:raw].to_s.include? "<NoHideDevs>"))
		PostOwnerChanger.new( post_ids: [post.id],
				topic_id: post.topic_id,
				new_owner: pizzaGroup.users.sample,
				acting_user: pizzaGroup.users.sample,
				skip_revision: false ).change_owner!
	end
end