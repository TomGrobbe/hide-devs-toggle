# name: hide_devs
# about: Hide pizza users, discourse plugin.
# version: 0.0.471
# authors: Tom Grobbe
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

			@user = pizzaGroup.users.sample if user.group_ids.include? hide.id
		end
	end

	class ::PostCreator
		prepend ::HideDevs::PostCreatorExtensions
	end

	class ::WebHookTopicViewSerializer
		prepend ::HideDevs::WebHookTopicViewSerializerExtensions
	end

	DiscourseEvent.on(:post_created) do |post, opts, user|
		next unless user.group_ids.include? hide.id
		# next unless post.content.include? "<show>"
		# puts post
		puts "Hey console here I am"
		# puts post.raw
		logger.info "blah"
        next unless post.raw.include? "show"
		PostOwnerChanger.new( post_ids: [post.id],
				topic_id: post.topic_id,
				new_owner: pizzaGroup.users.sample,
				acting_user: pizzaGroup.users.sample,
				skip_revision: false ).change_owner! if post.raw.include? "show"
	end
end